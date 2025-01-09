function layout_get_by_name(layer, name){


    for (const [key, value] of Object.entries(layer)) {
        //console.log(key +'->' +name);

        if (key === name){
            return value;
        }

        if ('children' in value) {
            let result = layout_get_by_name(value, name);

            if (result !== null) {
                return result;
            }
        }

        if (key === 'children') {
            let result = layout_get_by_name(value, name);

            if (result !== null) {
                return result;
            }
        }
    }
    return null;
}

function layer_to_rect(layer){
    return new Rect(layer['offset'][0],layer['offset'][1],layer['size'][0],layer['size'][1]);
}


class LayerWidget extends  WidgetBase{

    constructor(inRect) {
        super(inRect);
        this.card_info = undefined;
        this.scale = new Vector2(1,1);
        this.offset = new Vector2(0,0);
    }

    isInMe(inVal)
    {
        if(inVal !== undefined)
        {
            if( (inVal.x >= this.x+this.offset.x) && (inVal.x < (this.x + this.w+this.offset.x)) && (inVal.y >= this.y+this.offset.y) && (inVal.y < (this.y + this.h+this.offset.y)) )
            {
                return true;
            }
        }

        return false;
    }


    set_scale(scale){
        this.scale.set(scale);
    }

    set_offset(offset){
        this.offset.set(offset);
    }

    format_desc(in_str, max_chars){

        let out_str = '';

        if(in_str.length) {
            let words = in_str.split(" ");

            let current_line = '';
            for (let i = 0; i < words.length; i++) {
                if (current_line.length + words[i].length > max_chars) {
                    out_str += current_line;
                    out_str += '\n';
                    current_line = '';
                }

                current_line += words[i] + ' ';
            }

            out_str += current_line;
        }
        return out_str;
    }

    layer_to_rect(loc, layer){
        return new Rect((layer['offset'][0] * this.scale.x)  + loc.x
            , (layer['offset'][1] * this.scale.y)  + loc.y
            , layer['size'][0] * this.scale.x
            , layer['size'][1] * this.scale.y);
    }

    debug_rect(loc, layer, col){
        GAZCanvas.Rect(this.layer_to_rect(loc,layer), col);
        GAZCanvas.Rect(this.layer_to_rect(loc,layer), 'rgb(0,0,0)', false, 1);

    }

    debug_text(loc, layer, font_size, text, color, just, font, font_style){

        let pos= loc.clone();

        pos.x = loc.x + ((layer['offset'][0]) * this.scale.x);
        pos.y = loc.y + ((layer['offset'][1]) * this.scale.y);

        if ((just === 'centre') || (just == 'center')){
            pos.x += (layer['size'][0]/2) * this.scale.x;
            pos.y += (layer['size'][1]/2) * this.scale.y;
        }

        GAZCanvas.Text(font_size* this.scale.y, text, pos, color, just, font, font_style);
    }

    debug_layer(loc, layer){
        if ('children' in layer){
            for (const [key, value] of Object.entries(layer['children'])) {
                this.debug_layer(loc, value);
            }
        }else{
            this.debug_rect(loc, layer, appInst.view.random.getRandomColor());
        }
    }

    debug_image(loc, layer, image, aspect_correct){
        let r= this.layer_to_rect(loc,layer);

        if((image.naturalWidth > 0) && (aspect_correct === undefined) || (aspect_correct===true)){
            let f = (r.h / image.naturalHeight);
            let w = image.naturalWidth * f;
            let h = image.naturalHeight * f;

            r.x += (r.w - w)/2;
            r.w = w;

        }
        GAZCanvas.Sprite(image, r);
    }

}

class LayerWidgetBase extends LayerWidget{
    constructor(layer) {
        super(layer_to_rect(layer));
        this.layer = layer;
    }

    update(){
        return false;
    }

    draw(){
        let loc = new Vector2(0, 0);
        this.debug_layer(loc, this.layer);
    }
}

class LayerWidgetText extends LayerWidgetBase{
    constructor(layer) {
        super(layer);

        this.label = 'set label text';

        this.font_family = appInst.view.get_font_family();
        this.font_size = 24;
        this.font_style = 'bold';
        this.font_just = 'center';

        this.font_color = 'rgb(0,0,0)';
        this.max_line_length = Math.floor((this.w*2.0) / this.font_size);
    }

    draw(){
        let text_font_size = this.font_size;

        let pos = new Vector2();

        let r = this.layer_to_rect(this.offset, this.layer);

        pos.x = r.x;
        pos.y = r.y;

        if(this.font_just == 'center'){
            pos.x += r.w/2;
            pos.y += r.h/2;
        }else{
            pos.x += text_font_size/2;
            pos.y += text_font_size;
        }

        let current_style = this.font_style;

        if(this.label.length) {

            let words = this.label.replace('\n', ' \n ').split(" ");

            let current_line = '';
            for (let i = 0; i < words.length; i++) {
                if (words[i].length) {
                    if (words[i][0] === '<') {
                        if (words[i] == '<br>') {
                            GAZCanvas.Text(text_font_size, current_line, pos, this.font_color //this.font_color
                                , this.font_just
                                , this.font_family
                                , current_style);

                            current_line = '';
                            pos.y += text_font_size;

                            pos.x = r.x;

                            if (this.font_just == 'center') {
                                pos.x += r.w / 2;
                            } else {
                                pos.x += text_font_size / 2;
                            }
                        }

                        if (words[i] == '<b>') {
                            if (current_style !== 'bold') {
                                if (current_line.length) {
                                    GAZCanvas.Text(text_font_size, current_line, pos, this.font_color //this.font_color
                                        , this.font_just
                                        , this.font_family
                                        , current_style);

                                    current_line = '';
                                    pos.y += text_font_size;
                                }
                                current_style = 'bold';


                            }
                        }
                        if (words[i] == '</b>') {
                            if (current_style === 'bold') {

                                if (current_line.length) {
                                    GAZCanvas.Text(text_font_size, current_line, pos, this.font_color
                                        , this.font_just
                                        , this.font_family
                                        , current_style);

                                    current_line = '';
                                    //pos.y += text_font_size;
                                }
                                current_style = '';


                            }
                        }
                    } else {
                        let text_to_print = current_line + words[i] + ' ';

                        let result = Canvas.MeasureText(text_font_size, text_to_print, pos, this.font_color
                                , this.font_just
                                , this.font_family
                                , current_style);

                        if( Math.floor(result) > Math.floor(this.w*this.scale.x)){
                            GAZCanvas.Text(text_font_size, current_line, pos, this.font_color
                                , this.font_just
                                , this.font_family
                                , current_style);

                            current_line = '';
                            pos.y += text_font_size;
                        }

                        current_line += words[i] + ' ';
                    }
                }
            }

            if (current_line.length > 0) {
                GAZCanvas.Text(text_font_size, current_line, pos, this.font_color
                    , this.font_just
                    , this.font_family
                    , current_style);

                pos.y += ((current_line.split('\n').length) * text_font_size);
            }
        }
    }
}

class LayerWidgetRect extends LayerWidgetBase{
    constructor(layer) {
        super(layer);

        this.current_color = 'rgb(255,255,255)';
    }

    draw(){
        this.debug_rect(new Vector2(0,0),this.layer, this.current_color);
    }
}

class LayerWidgetClickable extends LayerWidgetBase{
    constructor(layer) {
        super(layer);
        this.active = true;

        this.current_color = 'rgb(0,255,0)';
    }

    update() {
        super.update();

        if(this.visible === false){
            return false;
        }

        let r = this.layer_to_rect(this.offset, this.layer);

        if (Input.currentMouseState === INPUT_PRESSED) {
            if (r.isInMe(Input.mouseLogicalPos)) {
                return true;
            }
        }

        return false;
    }
    draw(){
        if(this.visible) {
            this.debug_rect(new Vector2(0, 0), this.layer, this.current_color);
        }
    }
}

class LayerWidgetClickableImage extends LayerWidgetClickable{

    constructor(layer) {
        super(layer);

        this.image = undefined;
        this.aspect_correct = false;

    }

    update() {

        this.current_color = 'rgb(0,255,0)';

        if(this.visible === false){
            return false;
        }

        let r = this.layer_to_rect(this.offset, this.layer);

        if (r.isInMe(Input.mouseLogicalPos)) {
            this.current_color = 'rgb(255,0,0)';
            return (Input.currentMouseState === INPUT_PRESSED);
        }

        return false;
    }

    draw(){
        if(this.visible) {

            if (this.image !== undefined) {
                this.debug_image(this.offset, this.layer, this.image, this.aspect_correct);
            }else{
                this.debug_rect(this.offset,this.layer,this.current_color);
            }
        }
    }
}

class LayerWidgetButton extends LayerWidgetClickable{
    constructor(layer) {
        super(layer);
        this.active = true;

        this.button_text = new LayerWidgetText(layer);
        this.current_color = 'rgb(0,255,0)';
    }

    set_label(text){
        this.button_text.label = text;
    }

    update() {
        super.update();

        if(this.visible === false){
            return false;
        }

        if(this.active === false){
            this.current_color = 'rgb(255,127,127)';
        }else {
            if (this.selected === true) {
                this.current_color = 'rgb(127,127,255)';
            } else {
                if (this.isInMe(Input.mouseLogicalPos) === true) {
                    this.current_color = 'rgb(0,255,255)';
                } else {
                    this.current_color = 'rgb(0,255,0)';
                }
            }

            if (Input.currentMouseState === INPUT_PRESSED) {
                if (this.isInRect(Input.mouseLogicalPos)) {
                    return true;
                }
            }
        }

        return false;
    }
    draw(){
        if(this.visible) {
            this.debug_rect(new Vector2(0, 0), this.layer, this.current_color);
            this.button_text.draw();
        }
    }
}

class LayerModal extends LayerWidgetBase
{
    constructor(layer) {
        super(layer);

        this.bg = new LayerWidgetRect(layout_get_by_name(layer, 'bg'));
        this.bg.current_color = 'rgb(127,127,127)';

        this.heading_text = new LayerWidgetText(layout_get_by_name(layer, 'heading_text'));
        this.heading_text.current_color= 'rgb(255,0,255)';
        this.body_text = new LayerWidgetText(layout_get_by_name(layer, 'body_text'));
        this.body_text.current_color= 'rgb(255,0,255)';

        this.ok_button = new LayerWidgetButton(layout_get_by_name(layer, 'ok_button'));
        this.ok_button.button_text.label = 'OK';
        this.cancel_button = new LayerWidgetButton(layout_get_by_name(layer, 'cancel_button'));
        this.cancel_button.button_text.label = 'Cancel';
    }

    set_text(heading_text, body_text){
        this.heading_text.label = heading_text;
        this.body_text.label = body_text;

    }

    update(){
        if(this.ok_button.update()){
            return  1;
        }
        if (this.cancel_button.update()){
            return -1;
        }

        return 0;
    }

    draw()
    {
        let loc = new Vector2(0,0);

        this.bg.draw();
        this.heading_text.draw();
        this.body_text.draw();

        this.ok_button.draw();
        this.cancel_button.draw();
    }
}

class LayerWidgetResillienceTable extends LayerWidgetBase{

    constructor(layer) {
        super(layer);

        this.resilience_table = {};

    }

    init(){

    }

    set_resilience(resilience_table){
        Object.assign(this.resilience_table,resilience_table);
    }

    draw() {
        super.draw();

        let headings = ['EP','BP','FP','DP','HP'];

        let loc = new Vector2(0, 0);

        let cols = [
            'rgb(88,39,120)',
            'rgb(63,143,97)',
            'rgb(107,128,221)',
            'rgb(246,153,88)',
            'rgb(244,201,57)',
        ];

        for(let i=0;i<5;i++) {
            let c = layout_get_by_name(this.layer,'p' + i.toString());

            this.debug_rect(loc, c['children']['heading'], cols[i]);
            this.debug_rect(loc, c['children']['value'], 'rgb(210,210,210)');

            this.debug_text(loc, c['children']['heading'], 20, headings[i], 'rgba(255,255,255)', 'center', appInst.view.get_font_family(), 'bold');
            this.debug_text(loc, c['children']['value'], 20, this.resilience_table[headings[i]].toString(), 'rgba(0,0,0)', 'center', appInst.view.get_font_family(), 'bold');
        }
    }
}

class ViewBase extends MVCBase{
    constructor(game){
        super(game);

        this.image = new Image();

        this.random_seed = 23450;
        this.random = new Random(this.random_seed);

        this.event_map = new Image();

        this.image_bank = {};
    }

    on_draw_start(){
        this.random = new Random(this.random_seed);
    }

    oneTimeInit() {

        this.image_bank = {};
        this.image_bank['interventions'] = [];
        this.image_bank['personas'] = [];
        this.image_bank['events'] = [];

        let cards = appInst.model.get_intervention_cards();

        for(let i=0;i< cards.length;i++){
            if(cards[i]['img'] !== ''){

                let entry = {};
                entry['image'] = new Image();
                entry['qr_code'] = new Image();

                entry['image'].src = "assets/interventions/" + cards[i]['img'];
                entry['qr_code'].src = cards[i]['qr_code'];

                this.image_bank['interventions'].push(entry);
            }
        }

        let persona_cards = appInst.model.get_persona_cards();
        for(let i=0;i< persona_cards.length;i++){

            if(persona_cards[i]['img'] !== ''){
                let entry = {};
                entry['image'] = new Image();
                entry['qr_code'] = new Image();

                entry['image'].src = "assets/personas/" + persona_cards[i]['img'];
                entry['qr_code'].src = persona_cards[i]['qr_code'];

                this.image_bank['personas'].push(entry);
            }
        }

        cards = appInst.model.get_event_cards();

        for(let i=0;i< cards.length;i++){
            if(cards[i]['img'] !== ''){

                let entry = {};
                entry['image'] = new Image();
                entry['qr_code'] = new Image();

                entry['image'].src = "assets/events/event_matrix.png";
                entry['qr_code'].src = cards[i]['qr_code'];

                this.image_bank['events'].push(entry);
            }
        }

        this.image_bank['arsinoe_logo'] = [];
        let logo = new Image();
        logo.src = 'assets/arsinoe_logo.png';
        this.image_bank['arsinoe_logo'].push(logo);
    }

    get_qrcode(){
        return this.image_bank['intervention_qrcodes'][0];
    }

    get_arsinoe_logo(){
        return this.image_bank['arsinoe_logo'][0];
    }

    get_font_family(){
        return 'inter';
    }
}

