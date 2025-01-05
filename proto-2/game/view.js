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

            r.x += w/2;
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

        this.font_family = 'roboto';
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

                        if(result >= (this.w*this.scale.x)){
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



class CardWidgetBase extends LayerWidget {
    constructor(inRect) {
        super(inRect);

        this.card_info = undefined;
        this.template_name = 'template_intervention_card';
        this.card_index = 0;
        this.card_set = undefined;
    }

    init(){
        this.template = layout_get_by_name(layout, this.template_name);

        let bg = layout_get_by_name(this.template,'bg');

        this.scale.x = this.w / (layout_get_by_name(this.template,'bg')["size"][0]);
        this.scale.y = this.h / (layout_get_by_name(this.template,'bg')["size"][1]);

        /*
        this.qr_code_link = new WidgetBase( this.layer_to_rect(new Vector2(this.x,this.y), layout_get_by_name(this.template,'qr_code') ));
        this.qr_code_link.set_active(true);
        this.qr_code_link.on_click = function (d) {
            console.log('QR link!');
            window.open('website/game/events/flood_event.pdf', '','location=yes,height=570,width=520,scrollbars=yes,status=yes');
        };*/

        this.qr_code_link = new LayerWidgetClickableImage(layout_get_by_name(this.template,'qr_code'));
        this.qr_code_link.set_scale(this.scale);
        this.qr_code_link.set_offset(new Vector2(this.x, this.y));
        this.qr_code_link.image = appInst.view.get_qrcode();

        this.side = 'front';

        this.heading_font_size = 24;
        this.content_font_size = 18;
    }

    set_display(side){
        this.side = side;
    }

    set_card_info(index) {
        this.card_index = index;
        this.card_info = this.card_set[this.card_index];
    }

    get_bg_col(){
        return 'rgb(127,127,127)';
    }

    update() {
        super.update();
        if(this.qr_code_link.update() === true){
            window.open('website/game/events/flood_event.pdf', '','location=yes,height=570,width=520,scrollbars=yes,status=yes');
        }
    }

    draw_bg(loc){
        this.debug_rect(loc, layout_get_by_name(this.template,'bg'), this.get_bg_col() );
    }

    draw(){
        if (this.visible === true) {
            if (this.side === 'front') {
                this.draw_front();
            } else {
                this.draw_back();
            }
        }
    }

    draw_front(){
        let loc = new Vector2(this.x, this.y);
        this.draw_bg(loc);

        this.debug_layer(loc, layout_get_by_name(this.template, 'front') );
    }

    draw_back(){
        let loc = new Vector2(this.x, this.y);
        this.draw_bg(loc);

        this.debug_layer(loc, layout_get_by_name(this.template, 'back') );
    }
}

class EventCardWidget  extends CardWidgetBase {
    constructor(layer) {
        super(layer_to_rect(layer));
        this.template = layer;
        this.template_name = 'template_event_card';
    }

    init(){
        super.init();
        this.content_font_size = 16;

        this.card_set = appInst.model.get_event_cards();
    }

    draw_front() {
        let loc = new Vector2(this.x, this.y);
        this.draw_bg(loc);

        let template = layout_get_by_name(this.template, 'front');
        this.qr_code_link.draw(loc);

        let title = this.card_info['name'].toUpperCase();
        this.debug_text(loc, layout_get_by_name(template,'header_text'), this.heading_font_size*this.scale.y, title, 'rgba(0,0,0)', 'center', 'roboto', 'bold');

        //right side
        {
            let floating_text = new LayerWidgetText(layout_get_by_name(this.template, 'right_floating_text'));
            floating_text.font_just = 'left';
            floating_text.font_size = this.content_font_size * this.scale.x;
            floating_text.font_style = '';
            floating_text.font_family = 'roboto';
            floating_text.font_color = 'rgb(0,0,0)';
            floating_text.max_line_length = 44;

            floating_text.set_scale(this.scale);
            floating_text.set_offset(new Vector2(this.x, this.y));

            floating_text.label = '';

            for (let i = 1; i < 4; i++) {
                floating_text.label += ' <b> ';
                floating_text.label += this.card_info['heading-' + i.toString()];
                floating_text.label += ' </b> ';
                floating_text.label += ' <br> ';

                floating_text.label += this.card_info['desc-' + i.toString()];
                floating_text.label += ' <br> ';
                floating_text.label += ' <br> ';

            }
            floating_text.draw();
        }

        //left side
        {
            let floating_text = new LayerWidgetText(layout_get_by_name(this.template, 'left_floating_text'));
            floating_text.font_just = 'left';
            floating_text.font_size = this.content_font_size * this.scale.x;
            floating_text.font_style = '';
            floating_text.font_family = 'roboto';
            floating_text.font_color = 'rgb(0,0,0)';
            floating_text.max_line_length = 40;

            floating_text.set_scale(this.scale);
            floating_text.set_offset(new Vector2(this.x, this.y));

            floating_text.label = '';
            floating_text.label += ' <b> ';

            floating_text.label += this.card_info['heading-0'];
            floating_text.label += ' </b> ';
            floating_text.label += ' <br> ';

            floating_text.label += this.card_info['desc-0'];


            floating_text.draw();
        }

        this.debug_image(loc,layout_get_by_name(template,'image_loc'), appInst.view.event_map, false);
    }

    draw_back() {
        super.draw_back();
        let loc = new Vector2(this.x, this.y);
        this.draw_bg(loc);

        let template = layout_get_by_name(this.template, 'back');

        let title = this.card_info['outcome-heading'].toUpperCase();
        this.debug_text(loc, layout_get_by_name(template,'header_text'), this.heading_font_size*this.scale.y, title, 'rgba(0,0,0)', 'center', 'roboto', 'bold');


        let floating_text = new LayerWidgetText(layout_get_by_name(this.template, 'floating_text'));
        floating_text.font_just = 'left';
        floating_text.font_size = this.content_font_size * this.scale.x;
        floating_text.font_style = '';
        floating_text.font_family = 'roboto';
        floating_text.font_color = 'rgb(0,0,0)';
        floating_text.max_line_length = 90;

        floating_text.set_scale(this.scale);
        floating_text.set_offset(new Vector2(this.x, this.y));

        floating_text.label = '';

        for(let i=0;i< appInst.model.event_prepareness.length;i++) {
            floating_text.label += ' <b> ';
            floating_text.label +=appInst.model.event_prepareness[i];
            floating_text.label += ' </b> ';
            floating_text.label += ' <br> ';

            floating_text.label += this.card_info['outcome-' + i.toString()];

            floating_text.label += ' <br> ';
            floating_text.label += ' <br> ';
        }

        floating_text.draw();
    }
}

class PersonaCardWidget extends CardWidgetBase{
    constructor(inRect) {
        super(inRect);

        this.template_name = 'template_persona_card';
        this.card_set = appInst.model.get_persona_cards();
    }

    draw_front(){
        let loc = new Vector2(this.x, this.y);
        this.draw_bg(loc);

        let template = layout_get_by_name(this.template,'front');
        this.qr_code_link.draw(loc);

        let title = this.card_info['name'].toUpperCase();

        let max_line_length = 22;

        if (title.length > max_line_length) {
            this.debug_text(new Vector2(loc.x,loc.y-((this.heading_font_size/2)*this.scale.y) ), template['children']['header_text'], this.heading_font_size, this.format_desc(title, max_line_length), 'rgba(0,0,0)', 'center', 'roboto', 'bold');
        }else {
            this.debug_text(loc, layout_get_by_name(template,'header_text'), this.heading_font_size, title, 'rgba(0,0,0)', 'center', 'roboto', 'bold');
        }

        this.debug_image(loc, layout_get_by_name(template,'image_loc'),appInst.view.image_bank['personas'][this.card_index] );

        let floating_text = new LayerWidgetText(layout_get_by_name(template, 'floating_text'));
        floating_text.current_color= 'rgb(0,0,0)';
        floating_text.label = this.card_info['desc'];
        floating_text.font_style = '';
        floating_text.font_just = 'left';
        floating_text.font_size = this.content_font_size*this.scale.y;
        floating_text.set_scale(this.scale);
        floating_text.set_offset(new Vector2(this.x, this.y));
        floating_text.max_line_length = 44;

        floating_text.draw();



        //do description
        if (false) {
            let t = template['children']['floating_text'];
            let pos = new Vector2();

            pos.x = loc.x + (t['offset'][0]) * this.scale.x;
            pos.y = loc.y + (t['offset'][1]) * this.scale.y;

            pos.y += 10 * this.scale.y;

            max_line_length = Math.floor((45 * this.content_font_size) / 18.0);

            let text_font_size = this.content_font_size * this.scale.y;

            let text = this.format_desc(this.card_info['desc'], max_line_length);

            pos.x = loc.x + (t['offset'][0] + t['size'][0] / 2) * this.scale.x;

            GAZCanvas.Text(text_font_size, text, pos, 'rgb(0,0,0)', 'center', 'roboto', '');

            pos.y += ((text.split('\n').length) * text_font_size);

            //do positives
            pos.y += 7 * this.scale.y;
            pos.x = loc.x + (t['offset'][0] * this.scale.x);

            //text_font_size = 16*this.scale.y;
            GAZCanvas.Text(text_font_size, "Positives", pos, 'rgb(0,0,0)', 'left', 'roboto', 'bold');
            pos.y += text_font_size;

            for (let p = 0; p < 3; p++) {
                text = (p + 1).toString() + '.';
                text += this.format_desc(this.card_info['pos-' + (p + 1).toString()], max_line_length);
                GAZCanvas.Text(text_font_size, text, pos, 'rgb(0,0,0)', 'left', 'roboto', '');
                pos.y += ((text.split('\n').length) * text_font_size);
            }

            //do issues
            pos.y += 5 * this.scale.y;

            GAZCanvas.Text(text_font_size, "Potential Issues", pos, 'rgb(0,0,0)', 'left', 'roboto', 'bold');
            pos.y += text_font_size;

            for (let p = 0; p < 3; p++) {
                text = (p + 1).toString() + '.';
                text += this.format_desc(this.card_info['neg-' + (p + 1).toString()], max_line_length);
                GAZCanvas.Text(text_font_size, text, pos, 'rgb(0,0,0)', 'left', 'roboto', '');
                pos.y += ((text.split('\n').length) * text_font_size);
            }
        }
    }

    draw_back(){
        let loc = new Vector2(this.x, this.y);
        this.draw_bg(loc);
    }
}

class InterventionCardWidget extends  CardWidgetBase{
    constructor(inRect) {
        super(inRect);

        this.card_set = appInst.model.get_intervention_cards();
    }

    get_bg_col(){
        if (this.card_info['type'] == 'HP'){
            return 'rgb(246,244,113)';
        }

        if (this.card_info['type'] == 'BP'){
            return 'rgb(244,174,100)';
        }

        if (this.card_info['type'] == 'DP'){
            return 'rgb(143,161,246)';
        }

        if (this.card_info['type'] == 'FP') {
            return 'rgb(179,218,244)';
        }

        return 'rgb(127,127,127)';
    }

    draw_front(){
        let loc = new Vector2(this.x, this.y);
        this.draw_bg(loc);

        let template = layout_get_by_name(this.template,'front');
        this.qr_code_link.draw(loc);

        let title = this.card_info['name'].toUpperCase() + ':' +this.card_info['case_study'];

        let max_line_length = 22;

        if (title.length > max_line_length) {
            this.debug_text(new Vector2(loc.x,loc.y-((this.heading_font_size/2)*this.scale.y) ), template['children']['header_text'], this.heading_font_size, this.format_desc(title, max_line_length), 'rgba(0,0,0)', 'center', 'roboto', 'bold');
        }else {
            this.debug_text(loc, layout_get_by_name(template,'header_text'), this.heading_font_size, title, 'rgba(0,0,0)', 'center', 'roboto', 'bold');
        }

        this.debug_image(loc, layout_get_by_name(template,'image_loc'),appInst.view.image_bank['interventions'][this.card_index] );

        let floating_text = new LayerWidgetText(layout_get_by_name(template, 'floating_text'));
        floating_text.current_color= 'rgb(0,0,0)';
        floating_text.label = this.card_info['desc'];
        floating_text.font_style = '';
        floating_text.font_just = 'left';
        floating_text.font_size = this.content_font_size*this.scale.y;
        floating_text.set_scale(this.scale);
        floating_text.set_offset(new Vector2(this.x, this.y));
        floating_text.max_line_length = 50;

        floating_text.draw();

        //do protection racket
        let headings = ['EP','BP','FP','DP','HP'];

        let pos = loc.clone();
        pos.y +=1*this.scale.y;

        for(let i=0;i<5;i++) {
            let c = layout_get_by_name(template,'protection_table')['children']['p' + i.toString()];

            this.debug_rect(loc, c['children']['heading'], 'rgb(28,96,126)');
            this.debug_rect(loc, c['children']['value'], 'rgb(210,210,210)');

            this.debug_text(pos, c['children']['heading'], 20*this.scale.y, headings[i], 'rgba(255,255,255)', 'center', 'roboto', 'bold');
            this.debug_text(pos, c['children']['value'], 20*this.scale.y, this.card_info[headings[i]], 'rgba(0,0,0)', 'center', 'roboto', 'bold');
        }
    }

    draw_back(){
        let loc = new Vector2(this.x, this.y);
        this.draw_bg(loc);

        let template = layout_get_by_name(this.template,'back');

        //this.debug_layer(loc, template);

        let title = 'outcomes'.toUpperCase();

        this.debug_text(loc, layout_get_by_name(template,'header_text'), 28*this.scale.y, title, 'rgba(0,0,0)', 'center', 'roboto', 'bold');


        //do description
        let t = template['children']['floating_text'];
        let pos = new Vector2();

        pos.x = loc.x + (t['offset'][0])*this.scale.x;
        pos.y = loc.y + (t['offset'][1])*this.scale.y;

        pos.y += 10*this.scale.y;

        let text_font_size = this.content_font_size * this.scale.y;

        //do outcomes
        pos.y += 7*this.scale.y;
        pos.x = loc.x + (t['offset'][0]*this.scale.x);

        let dice = ['1: Oh Dear!','2-3: Not Good','4-5:Not Bad','6:Great'];

        let max_line_length = Math.floor((46 * this.content_font_size)/18.0);

        for(let p=0;p<4;p++) {
            GAZCanvas.Text(text_font_size, dice[p], pos, 'rgb(0,0,0)', 'left', 'roboto', 'bold');
            pos.y += text_font_size *1.1;

            let text= this.format_desc(this.card_info['outcome-' + (p).toString()], max_line_length);
            GAZCanvas.Text(text_font_size, text, pos, 'rgb(0,0,0)', 'left', 'roboto', '');
            pos.y +=((text.split('\n').length) * text_font_size);


            if(p==0){
                GAZCanvas.Text(text_font_size, 'The citizens demand a new mayor!', pos, 'rgb(0,0,0)', 'left', 'roboto', 'bold');
                pos.y += text_font_size *1.1;
            }

            pos.y += text_font_size *1.1;
        }
    }
}



class ViewBase extends MVCBase{
    constructor(game){
        super(game);

        this.image = new Image();

        this.random = new Random(123456);

        this.event_map = new Image();

        this.image_bank = {};
    }

    on_draw_start(){
        this.random = new Random(123456);
    }

    oneTimeInit() {

        this.image_bank = {};
        this.image_bank['interventions'] = [];
        this.image_bank['personas'] = [];

        this.image_bank['intervention_qrcodes'] = [];

        let intervention_cards = appInst.model.get_intervention_cards();

        for(let i=0;i< intervention_cards.length;i++){
            this.image_bank['interventions'].push(new Image());

            if(intervention_cards[i]['img'] !== ''){
                this.image_bank['interventions'][i].src = "assets/interventions/" + intervention_cards[i]['img'];
            }
        }

        let persona_cards = appInst.model.get_persona_cards();
        for(let i=0;i< persona_cards.length;i++){
            this.image_bank['personas'].push(new Image());

            if(persona_cards[i]['img'] !== ''){
                this.image_bank['personas'][i].src = "assets/persona/" + persona_cards[i]['img'];
            }
        }

        this.image.src = "assets/interventions/intervention-0.png";
        this.event_map.src = "assets/events/event_matrix.png";

        let default_qrcode = new Image();
        default_qrcode.src = 'assets/default_qrcode.png';
        this.image_bank['intervention_qrcodes'].push(default_qrcode);
    }

    get_qrcode(){
        return this.image_bank['intervention_qrcodes'][0];
    }

}