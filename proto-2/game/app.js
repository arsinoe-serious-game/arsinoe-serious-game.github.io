/*
        EP - Economic protection
        BP - Bio (diversity) protection
        FP - Flood protection
        DP - Drought protection
        HP - Heat protection
     */

class LayerWidget extends  WidgetBase{

    constructor(inRect) {
        super(inRect);
        this.card_info = undefined;
        this.scale = new Vector2(1,1);
    }

    format_desc(in_str, max_chars){

        let out_str = '';

        let words = in_str.split(" ");

        let current_line = '';
        for(let i=0;i<words.length;i++){
            if (current_line.length + words[i].length > max_chars){
                out_str += current_line;
                out_str += '\n';
                current_line = '';
            }

            current_line += words[i] + ' ';
        }

        out_str += current_line;

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

    debug_image(loc, layer, image){
        GAZCanvas.Sprite(appInst.view.image, this.layer_to_rect(loc,layer) );
    }
}

function layout_get_by_name(layer, name){

    for (const [key, value] of Object.entries(layer)) {
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

class CardWidgetBase extends LayerWidget {
    constructor(inRect) {
        super(inRect);

        this.card_info = undefined;
        this.template_name = 'template_intervention_card';
    }

    init(){
        this.template = layout_get_by_name(layout, this.template_name);

        let bg = layout_get_by_name(this.template,'bg');

        this.scale.x = this.w / (layout_get_by_name(this.template,'bg')["size"][0]);
        this.scale.y = this.h / (layout_get_by_name(this.template,'bg')["size"][1]);

        this.qr_code_link = new WidgetBase( this.layer_to_rect(new Vector2(this.x,this.y), layout_get_by_name(this.template,'qr_code') ));
        this.qr_code_link.set_active(true);
        this.qr_code_link.on_click = function (d) {
            console.log('QR link!');
            window.open('website/game/events/flood_event.pdf', '','location=yes,height=570,width=520,scrollbars=yes,status=yes');
        };

        this.side = 'front';

        this.heading_font_size = 24;
        this.content_font_size = 18;
    }

    set_display(side){
        this.side = side;
    }

    set_card_info(card_info) {
        this.card_info = card_info;
    }

    get_bg_col(){
        return 'rgb(127,127,127)';
    }

    update() {
        super.update();
        this.qr_code_link.update();
    }

    draw_bg(loc){
        this.debug_rect(loc, layout_get_by_name(this.template,'bg'), this.get_bg_col() );
    }

    draw(){

        if (this.side === 'front'){
            this.draw_front();
        }else{
            this.draw_back();
        }


        //super.draw();
    }

    draw_front(){

    }

    draw_back(){

    }
}

class PersonaCardWidget extends CardWidgetBase{
    constructor(inRect) {
        super(inRect);

        this.template_name = 'template_persona_card';
    }

    draw_front(){
        let loc = new Vector2(this.x, this.y);
        this.draw_bg(loc);

        let template = layout_get_by_name(this.template,'front');
        this.qr_code_link.draw();

        let title = this.card_info['name'].toUpperCase();

        let max_line_length = 22;

        if (title.length > max_line_length) {
            this.debug_text(new Vector2(loc.x,loc.y-((this.heading_font_size/2)*this.scale.y) ), template['children']['header_text'], this.heading_font_size*this.scale.y, this.format_desc(title, max_line_length), 'rgba(0,0,0)', 'center', 'roboto', 'bold');
        }else {
            this.debug_text(loc, layout_get_by_name(template,'header_text'), this.heading_font_size*this.scale.y, title, 'rgba(0,0,0)', 'center', 'roboto', 'bold');
        }

        this.debug_image(loc, layout_get_by_name(template,'image_loc'),this.image);


        //do description
        let t = template['children']['floating_text'];
        let pos = new Vector2();

        pos.x = loc.x + (t['offset'][0])*this.scale.x;
        pos.y = loc.y + (t['offset'][1])*this.scale.y;

        pos.y += 10*this.scale.y;

        max_line_length = Math.floor((45 * this.content_font_size)/18.0);

        let text_font_size = this.content_font_size * this.scale.y;

        let text = this.format_desc(this.card_info['desc'], max_line_length);

        pos.x = loc.x + (t['offset'][0] + t['size'][0]/2) * this.scale.x;

        GAZCanvas.Text(text_font_size, text, pos, 'rgb(0,0,0)', 'center', 'roboto', '');

        pos.y += ((text.split('\n').length) * text_font_size);

        //do positives
        pos.y += 7*this.scale.y;
        pos.x = loc.x + (t['offset'][0]*this.scale.x);

        //text_font_size = 16*this.scale.y;
        GAZCanvas.Text(text_font_size, "Positives", pos, 'rgb(0,0,0)', 'left', 'roboto', 'bold');
        pos.y += text_font_size;

        for(let p=0;p<3;p++) {
            text = (p + 1).toString() + '.';
            text += this.format_desc(this.card_info['pos-' + (p + 1).toString()], max_line_length);
            GAZCanvas.Text(text_font_size, text, pos, 'rgb(0,0,0)', 'left', 'roboto', '');
            pos.y +=((text.split('\n').length) * text_font_size);
        }

        //do issues
        pos.y += 5*this.scale.y;

        GAZCanvas.Text(text_font_size, "Potential Issues", pos, 'rgb(0,0,0)', 'left', 'roboto', 'bold');
        pos.y += text_font_size;

        for(let p=0;p<3;p++) {
            text = (p + 1).toString() + '.';
            text += this.format_desc(this.card_info['neg-' + (p + 1).toString()], max_line_length);
            GAZCanvas.Text(text_font_size, text, pos, 'rgb(0,0,0)', 'left', 'roboto', '');
            pos.y +=((text.split('\n').length) * text_font_size);
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
        this.qr_code_link.draw();

        let title = this.card_info['name'].toUpperCase();

        let max_line_length = 22;

        if (title.length > max_line_length) {
            this.debug_text(new Vector2(loc.x,loc.y-((this.heading_font_size/2)*this.scale.y) ), template['children']['header_text'], this.heading_font_size*this.scale.y, this.format_desc(title, max_line_length), 'rgba(0,0,0)', 'center', 'roboto', 'bold');
        }else {
            this.debug_text(loc, layout_get_by_name(template,'header_text'), this.heading_font_size*this.scale.y, title, 'rgba(0,0,0)', 'center', 'roboto', 'bold');
        }

        this.debug_image(loc, layout_get_by_name(template,'image_loc'),this.image);


        //do description
        let t = template['children']['floating_text'];
        let pos = new Vector2();

        pos.x = loc.x + (t['offset'][0])*this.scale.x;
        pos.y = loc.y + (t['offset'][1])*this.scale.y;

        pos.y += 10*this.scale.y;

        max_line_length = Math.floor((45 * this.content_font_size)/18.0);

        let text_font_size = this.content_font_size * this.scale.y;

        let text = this.format_desc(this.card_info['desc'], max_line_length);

        pos.x = loc.x + (t['offset'][0] + t['size'][0]/2) * this.scale.x;

        GAZCanvas.Text(text_font_size, text, pos, 'rgb(0,0,0)', 'center', 'roboto', '');

        pos.y += ((text.split('\n').length) * text_font_size);

        //do positives
        pos.y += 7*this.scale.y;
        pos.x = loc.x + (t['offset'][0]*this.scale.x);

        //text_font_size = 16*this.scale.y;
        GAZCanvas.Text(text_font_size, "Positives", pos, 'rgb(0,0,0)', 'left', 'roboto', 'bold');
        pos.y += text_font_size;

        for(let p=0;p<3;p++) {
            text = (p + 1).toString() + '.';
            text += this.format_desc(this.card_info['pos-' + (p + 1).toString()], max_line_length);
            GAZCanvas.Text(text_font_size, text, pos, 'rgb(0,0,0)', 'left', 'roboto', '');
            pos.y +=((text.split('\n').length) * text_font_size);
        }

        //do issues
        pos.y += 5*this.scale.y;

        GAZCanvas.Text(text_font_size, "Potential Issues", pos, 'rgb(0,0,0)', 'left', 'roboto', 'bold');
        pos.y += text_font_size;

        for(let p=0;p<3;p++) {
            text = (p + 1).toString() + '.';
            text += this.format_desc(this.card_info['neg-' + (p + 1).toString()], max_line_length);
            GAZCanvas.Text(text_font_size, text, pos, 'rgb(0,0,0)', 'left', 'roboto', '');
            pos.y +=((text.split('\n').length) * text_font_size);
        }

        //do protection racket
        let headings = ['EP','BP','FP','DP','HP'];

        pos = loc.clone();
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

        let dice = ['1: Very Bad','2-3: Bad','4-5:Alright','6:Great'];

        let max_line_length = Math.floor((46 * this.content_font_size)/18.0);

        for(let p=0;p<4;p++) {
            GAZCanvas.Text(text_font_size, dice[p], pos, 'rgb(0,0,0)', 'left', 'roboto', 'bold');
            pos.y += text_font_size *1.1;

            let text= this.format_desc(this.card_info['outcome-' + (p).toString()], max_line_length);
            GAZCanvas.Text(text_font_size, text, pos, 'rgb(0,0,0)', 'left', 'roboto', '');
            pos.y +=((text.split('\n').length) * text_font_size);
            pos.y += text_font_size *1.1;
        }
    }
}


function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function getCookieAsList(cname){
    let r = getCookie(cname).split(',');

    let result = [];

    for (let i=0;i< r.length;i++){
        result.push(r[i]);
    }

    return result;
}

function getCookieAsIntList(cname){
    let r = getCookie(cname).split(',');

    let result = [];

    for (let i=0;i< r.length;i++){
        if (r[i].length > 0) {
            result.push(parseInt(r[i]));
        }
    }

    return result;
}

class ModelBase{
    constructor(game){
        this.game = game;
        this.current_deck = [];
        this.selected_interventions = [];

        this.random = new Random(123456);
        this.random = new Random(new Date().getTime() / 1000);

        this.players = [];
        this.current_mayor = '';
    }

    do_cookie_data(b_get){

        if (b_get){
            let current_deck = getCookieAsIntList('current_deck');
            let selected_interventions =getCookieAsIntList('selected_interventions');
            let players = getCookieAsList('players');
            let current_mayor = getCookie('current_mayor');
            console.log(current_deck);
        }else{
            setCookie('current_deck', this.current_deck, 365);
            setCookie('selected_interventions', this.selected_interventions, 365);
            setCookie('players', this.players, 365);
            setCookie('current_mayor', this.current_mayor, 365);
        }
    }

    get_cookie_data(){
        return this.do_cookie_data(true);
    }

    set_cookie_data(){
        return this.do_cookie_data(false);
    }


    on_new_game(){
        this.current_deck = [];

        let index = 0;
        for(let i=0;i< intervention_cards.length;i++)
            this.current_deck.push(i);

        this.round = 0;
        this.selected_interventions = [];

        this.players = [];

        for(let i=1;i<5;i++){
            this.players.push('player-'+i.toString());
        }

        this.select_mayor();

        this.set_cookie_data();
        this.get_cookie_data();
    }

    select_mayor(){
        let new_mayor = '';

        do{
            new_mayor = this.random.getChoice(this.players);
        }while(new_mayor == this.current_mayor);

        this.current_mayor = new_mayor;
    }


    get_intervention_card(entry){
        return intervention_cards[entry];
    }

    select_intervention(entry) {
        this.selected_interventions.push(entry);

        const index = this.current_deck.indexOf(entry);
        if (index > -1) {
            this.current_deck.splice(index, 1);
        }
    }

    card_to_string(card){
        let text = '';
        try {
            text += (card['type'] + ' ' + card['name']).padEnd(40, ' ');
            text += '  EP:' + card['EP'].toString().padEnd(2, ' ');
            text += '  BP:' + card['BP'].toString().padEnd(2, ' ');
            text += '  FP:' + card['FP'].toString().padEnd(2, ' ');
            text += '  DP:' + card['DP'].toString().padEnd(2, ' ');
            text += '  HP:' + card['HP'].toString().padEnd(2, ' ');
        }catch (e){
            console.log('error');
        }

        return text;
    }


    get_round_cards() {
        let current_options = [];

        for (let i = 0; i < 4; i++) {
            while (true){
                let intervention = this.random.getChoice(this.current_deck);

                if ((current_options.indexOf(intervention) == -1) &&  !(this.invention_type_in_cards(intervention, current_options))) {
                    current_options.push(intervention);
                    break;
                }
            }
        }
        return current_options;
    }

    invention_type_in_cards(intervention, current_options) {
        for (let i = 0; i < current_options.length; i++) {
            let card = current_options[i];
            if (intervention_cards[intervention]['type'] == this.get_intervention_card(card)['type']) {
                return true;
            }
        }
        return false;
    }

    get_protection() {
        let protection = {};

        protection['EP'] = 0;
        protection['BP'] = 0;
        protection['FP'] = 0;
        protection['DP'] = 0;
        protection['HP'] = 0;

        for(let i=0;i< this.selected_interventions.length;i++) {
            let card = this.get_intervention_card(this.selected_interventions[i]);

            for (const [key, value] of Object.entries(protection)) {
                protection[key] += parseInt(card[key]);
            }
        }

        return protection;
    }

    get_response(severity, score) {
        if (severity == 'minor') {
            if (score < 1) {
                return 'under-prepared';
            }

            if (score < 3) {
                return 'appropriate';
            }

            if (score > 6) {
                return 'extreme overkill';
            }

            return 'overkill';
        }

        if (severity == 'average') {
            if (score < 1) {
                return 'severly under-prepared';
            }

            if (score < 3) {
                return 'under-prepared';
            }

            if (score < 5) {
                return 'appropriate';
            }

            if (score > 6) {
                return 'extreme overkill';
            }

            return 'overkill';
        }

        if (severity == 'extreme') {
            if (score < 3) {
                return 'severly under-prepared';
            }

            if (score < 5) {
                return 'under-prepared';
            }

            if (score > 7) {
                return 'overkill';
            }

            return 'appropriate';
        }

        return 'n/a';
    }
}

class ControllerBase{
    constructor(game){
        this.game = game;
    }
}

class ViewBase{
    constructor(game){
        this.game = game;

        this.image = new Image();

        this.random = new Random(123456);

    }

    on_draw_start(){
        this.random = new Random(123456);
    }

    oneTimeInit() {
        this.image.src = "assets/interventions/intervention-0.png";
    }

    format_desc(in_str, max_chars){

        let out_str = '';

        let words = in_str.split(" ");

        let current_line = '';
        for(let i=0;i<words.length;i++){
            if (current_line.length + words[i].length > max_chars){
                out_str += current_line;
                out_str += '\n';
                current_line = '';
            }

            current_line += words[i] + ' ';
        }

        out_str += current_line;

        return out_str;
    }

    debug_rect(loc, layer, col){

        GAZCanvas.Rect(new Rect((layer['offset'][0]/2) + loc.x, (layer['offset'][1]/2) + loc.y, layer['size'][0]/2, layer['size'][1]/2), col);
    }

    debug_text(loc, layer, font_size, text, color, just, font, font_style){

        let pos= loc.clone();

        pos.x += layer['offset'][0]/2;
        pos.y += layer['offset'][1]/2;

        if ((just === 'centre') || (just == 'center')){
            pos.x += (layer['size'][0]/ 2)/2;
            pos.y += (layer['size'][1]/ 2)/2;
        }

        GAZCanvas.Text(font_size, text, pos, color, just, font, font_style);
    }

    debug_layer(loc, layer){
        if ('children' in layer){
            for (const [key, value] of Object.entries(layer['children'])) {
                this.debug_layer(loc, value);
            }
        }else{
            GAZCanvas.Rect(new Rect((layer['offset'][0]/2) + loc.x, (layer['offset'][1]/2) + loc.y, layer['size'][0]/2, layer['size'][1]/2), this.random.getRandomColor());
        }
    }

    debug_image(loc, layer, image){
        let pos= loc.clone();

        pos.x += layer['offset'][0]/2;
        pos.y += layer['offset'][1]/2;

        GAZCanvas.Sprite(this.image, new Rect(pos.x, pos.y, layer['size'][0]/ 2, layer['size'][1]/ 2) );
    }

    intervention_card(loc, card_info, layer){

        let bg_col = 'rgb(127,127,127)';

        let template = layout['templates']['children']['template_intervention_card'];

        this.debug_rect(loc, template['children']['bg'], 'rgba(255,255,255)');
        this.debug_rect(loc, template['children']['qr_code'], 'rgba(255,0,255)');


        let title = card_info['name'].toUpperCase();

        let max_line_length = 17;

        if (title.length > max_line_length) {
                this.debug_text(new Vector2(loc.x,loc.y-3), template['children']['header_text'], 13, this.format_desc(title, max_line_length), 'rgba(0,0,0)', 'center', 'roboto', '');
        }else {
            this.debug_text(loc, template['children']['header_text'], 16, title, 'rgba(0,0,0)', 'center', 'roboto', '');
        }

        this.debug_image(loc, template['children']['image_loc'],this.image);

        let t = template['children']['floating_text'];
        let pos = new Vector2();

        pos.x = loc.x + t['offset'][0]/2;
        pos.y = loc.y + t['offset'][1]/2;

        pos.y += 5;

        max_line_length = 48;

        let text_font_size = 8;

        let text = this.format_desc(card_info['desc'], max_line_length);

        pos.x = loc.x + t['offset'][0]/2 + (t['size'][0]/2)/2;
        GAZCanvas.Text(text_font_size, text, pos, 'rgb(0,0,0)', 'center', 'roboto', '');

        pos.y += ((text.split('\n').length) * text_font_size);

        pos.y += 7;
        pos.x = loc.x + t['offset'][0]/2;

        GAZCanvas.Text(text_font_size, "Positives", pos, 'rgb(0,0,0)', 'left', 'roboto', 'bold');
        pos.y += text_font_size;

        for(let p=0;p<3;p++) {
            text = (p + 1).toString() + '.';
            text += this.format_desc(card_info['pos-' + (p + 1).toString()], max_line_length);
            GAZCanvas.Text(text_font_size, text, pos, 'rgb(0,0,0)', 'left', 'roboto', '');
            pos.y +=((text.split('\n').length) * text_font_size);
        }

        pos.y += 5;

        GAZCanvas.Text(text_font_size, "Potential Issues", pos, 'rgb(0,0,0)', 'left', 'roboto', 'bold');
        pos.y += text_font_size;

        for(let p=0;p<3;p++) {
            text = (p + 1).toString() + '.';
            text += this.format_desc(card_info['neg-' + (p + 1).toString()], max_line_length);
            GAZCanvas.Text(text_font_size, text, pos, 'rgb(0,0,0)', 'left', 'roboto', '');
            pos.y +=((text.split('\n').length) * text_font_size);
        }

        let headings = ['EP','BP','FP','DP','HP'];

        pos = loc.clone();
        pos.y +=1;

        for(let i=0;i<5;i++) {
            let c = template['children']['protection_table']['children']['p' + i.toString()];

            this.debug_rect(loc, c['children']['heading'], 'rgb(28,96,126)');
            this.debug_rect(loc, c['children']['value'], 'rgb(210,210,210)');

            this.debug_text(pos, c['children']['heading'], 10, headings[i], 'rgba(255,255,255)', 'center', 'roboto', 'bold');
            this.debug_text(pos, c['children']['value'], 10, card_info[headings[i]], 'rgba(0,0,0)', 'center', 'roboto', 'bold');
        }

        return;

        /*

        if (card_info['type'] == 'HP'){
            bg_col = 'rgb(0,255,0)';
        }

        if (card_info['type'] == 'BP'){
            bg_col = 'rgb(255,255,0)';
        }

        if (card_info['type'] == 'DP'){
            bg_col = 'rgb(0,255,255)';
        }

        if (card_info['type'] == 'FP'){
            bg_col = 'rgb(255,0,255)';
        }


        GAZCanvas.Rect(new Rect(loc.x, loc.y, 270, 395), bg_col);

        max_line_length = 22;

        //let title = card_info['type'] + ':' + card_info['name'].toUpperCase();
        title = card_info['name'].toUpperCase();

        if (title.length > max_line_length) {
            GAZCanvas.Text(15, this.format_desc(title, max_line_length), new Vector2(loc.x + 270 / 2, loc.y + 20 - 2), 'rgb(0,0,0)', 'center', 'roboto', 'bold');
        } else {
            GAZCanvas.Text(20, title, new Vector2(loc.x + 270 / 2, loc.y + 20), 'rgb(0,0,0)', 'center', 'roboto', 'bold');
        }

        GAZCanvas.Sprite(this.image, new Rect(loc.x + 46, loc.y + 48, 175, 125));

        let y = loc.y + 190;

        max_line_length = 50;

        let text = this.format_desc(card_info['desc'], max_line_length);
        GAZCanvas.Text(10, text, new Vector2(loc.x + 270 / 2, y), 'rgb(0,0,0)', 'center', 'roboto', '');

        y += ((text.split('\n').length) * 12);

        y += 7;

        GAZCanvas.Text(10, "Positives", new Vector2(loc.x + 26, y), 'rgb(0,0,0)', 'left', 'roboto', 'bold');
        y += 12;

        for(let p=0;p<3;p++) {
            text = (p + 1).toString() + '.';
            text += this.format_desc(card_info['pos-' + (p + 1).toString()], max_line_length);
            GAZCanvas.Text(10, text, new Vector2(loc.x + 26, y), 'rgb(0,0,0)', 'left', 'roboto', '');
            y +=((text.split('\n').length) * 12);
        }

        y += 5;

        GAZCanvas.Text(10, "Potential Issues", new Vector2(loc.x + 26, y), 'rgb(0,0,0)', 'left', 'roboto', 'bold');
        y += 12;

        for(let p=0;p<3;p++) {
            text = (p + 1).toString() + '.';
            text += this.format_desc(card_info['neg-' + (p + 1).toString()], max_line_length);
            GAZCanvas.Text(10, text, new Vector2(loc.x + 26, y), 'rgb(0,0,0)', 'left', 'roboto', '');
            y +=((text.split('\n').length) * 12);
        }


        y = loc.y + 333 + 18;
        GAZCanvas.Rect(new Rect(loc.x + 25, y, 222, 16), 'rgb(28,96,126)');


        y += 8 + 1;
        GAZCanvas.Text(10, "EP", new Vector2(loc.x + 43, y), 'rgb(255,255,255)', 'center', 'roboto', 'bold');
        GAZCanvas.Text(10, "BP", new Vector2(loc.x + 91, y), 'rgb(255,255,255)', 'center', 'roboto', 'bold');
        GAZCanvas.Text(10, "FP", new Vector2(loc.x + 138, y), 'rgb(255,255,255)', 'center', 'roboto', 'bold');
        GAZCanvas.Text(10, "DP", new Vector2(loc.x + 181, y), 'rgb(255,255,255)', 'center', 'roboto', 'bold');
        GAZCanvas.Text(10, "HP", new Vector2(loc.x + 226, y), 'rgb(255,255,255)', 'center', 'roboto', 'bold');


        y += 8;
        GAZCanvas.Rect(new Rect(loc.x + 25, y, 222, 16), 'rgb(210,210,210)');
        y += 8;
        GAZCanvas.Text(10, card_info['EP'], new Vector2(loc.x + 43, y), 'rgb(0,0,0)', 'center', 'roboto', 'bold');
        GAZCanvas.Text(10, card_info['BP'], new Vector2(loc.x + 91, y), 'rgb(0,0,0)', 'center', 'roboto', 'bold');
        GAZCanvas.Text(10, card_info['FP'], new Vector2(loc.x + 138, y), 'rgb(0,0,0)', 'center', 'roboto', 'bold');
        GAZCanvas.Text(10, card_info['DP'], new Vector2(loc.x + 181, y), 'rgb(0,0,0)', 'center', 'roboto', 'bold');
        GAZCanvas.Text(10, card_info['HP'], new Vector2(loc.x + 226, y), 'rgb(0,0,0)', 'center', 'roboto', 'bold');

    */
    }
}

class ARSINOEGame extends AppBase
{
    constructor()
    {
        super();

        this.model = new ModelBase(this);
        this.controller = new ControllerBase(this);
        this.view = new ViewBase(this);

        this.image = new Image();

        this.buttons = {};
        this.first_intervention = 0;

        this.stateMachine = new StateMachine();
    }



    oneTimeInit()
    {
        this.view.oneTimeInit();

        super.oneTimeInit(1600,900);
        this.stateMachine.addState(GameState_Test.label(), new GameState_Test());
        this.stateMachine.addState(GameState_InterventionPreview.label(), new GameState_InterventionPreview());
        this.stateMachine.addState(GameState_SimpleGame.label(), new GameState_SimpleGame());

        this.stateMachine.addState(GameState_InterventionPrint.label(), new GameState_InterventionPrint());
        this.stateMachine.addState(GameState_PersonaPrint.label(), new GameState_PersonaPrint());

        let current_mode = GameState_PersonaPrint.label();

        //this.stateMachine.setState(GameState_SimpleGame.label());
        //this.stateMachine.setState(GameState_InterventionPreview.label());
        this.stateMachine.setState(current_mode);

        this.image.src = "assets/interventions/intervention-0.png";
    }
    
    update()
    {
        super.update();
    }

    format_desc(in_str, max_chars){
        let out_str = '';

        let words = in_str.split(" ");

        let current_line = '';
        for(let i=0;i<words.length;i++){
            if (current_line.length + words[i].length > max_chars){
                out_str += current_line;
                out_str += '\n';
                current_line = '';
            }

            current_line += words[i] + ' ';
        }

        out_str += current_line;

        return out_str;
    }

    draw_card(offset, card_index){

        if (card_index < intervention_cards.length) {
            let card_info = intervention_cards[card_index];
            let bg_col = 'rgb(127,127,127)';

            if (card_info['type'] == 'HP'){
                bg_col = 'rgb(0,255,0)';
            }

            if (card_info['type'] == 'BP'){
                bg_col = 'rgb(255,255,0)';
            }

            if (card_info['type'] == 'DP'){
                bg_col = 'rgb(0,255,255)';
            }

            if (card_info['type'] == 'FP'){
                bg_col = 'rgb(255,0,255)';
            }


            GAZCanvas.Rect(new Rect(offset.x, offset.y, 270, 395), bg_col);

            let max_line_length = 22;

            //let title = card_info['type'] + ':' + card_info['name'].toUpperCase();
            let title = card_info['name'].toUpperCase();

            if (title.length > max_line_length) {
                GAZCanvas.Text(15, this.format_desc(title, max_line_length), new Vector2(offset.x + 270 / 2, offset.y + 20 - 2), 'rgb(0,0,0)', 'center', 'roboto', 'bold');
            } else {
                GAZCanvas.Text(20, title, new Vector2(offset.x + 270 / 2, offset.y + 20), 'rgb(0,0,0)', 'center', 'roboto', 'bold');
            }

            GAZCanvas.Sprite(this.image, new Rect(offset.x + 46, offset.y + 48, 175, 125));

            let y = offset.y + 190;

            max_line_length = 50;

            let text = this.format_desc(card_info['desc'], max_line_length);
            GAZCanvas.Text(10, text, new Vector2(offset.x + 270 / 2, y), 'rgb(0,0,0)', 'center', 'roboto', '');

            y += ((text.split('\n').length) * 12);

            y += 7;

            GAZCanvas.Text(10, "Positives", new Vector2(offset.x + 26, y), 'rgb(0,0,0)', 'left', 'roboto', 'bold');
            y += 12;

            for(let p=0;p<3;p++) {
                text = (p + 1).toString() + '.';
                text += this.format_desc(card_info['pos-' + (p + 1).toString()], max_line_length);
                GAZCanvas.Text(10, text, new Vector2(offset.x + 26, y), 'rgb(0,0,0)', 'left', 'roboto', '');
                y +=((text.split('\n').length) * 12);
            }

            y += 5;

            GAZCanvas.Text(10, "Potential Issues", new Vector2(offset.x + 26, y), 'rgb(0,0,0)', 'left', 'roboto', 'bold');
            y += 12;

            for(let p=0;p<3;p++) {
                text = (p + 1).toString() + '.';
                text += this.format_desc(card_info['neg-' + (p + 1).toString()], max_line_length);
                GAZCanvas.Text(10, text, new Vector2(offset.x + 26, y), 'rgb(0,0,0)', 'left', 'roboto', '');
                y +=((text.split('\n').length) * 12);
            }


            y = offset.y + 333 + 18;
            GAZCanvas.Rect(new Rect(offset.x + 25, y, 222, 16), 'rgb(28,96,126)');


            y += 8 + 1;
            GAZCanvas.Text(10, "EP", new Vector2(offset.x + 43, y), 'rgb(255,255,255)', 'center', 'roboto', 'bold');
            GAZCanvas.Text(10, "BP", new Vector2(offset.x + 91, y), 'rgb(255,255,255)', 'center', 'roboto', 'bold');
            GAZCanvas.Text(10, "FP", new Vector2(offset.x + 138, y), 'rgb(255,255,255)', 'center', 'roboto', 'bold');
            GAZCanvas.Text(10, "DP", new Vector2(offset.x + 181, y), 'rgb(255,255,255)', 'center', 'roboto', 'bold');
            GAZCanvas.Text(10, "HP", new Vector2(offset.x + 226, y), 'rgb(255,255,255)', 'center', 'roboto', 'bold');


            y += 8;
            GAZCanvas.Rect(new Rect(offset.x + 25, y, 222, 16), 'rgb(210,210,210)');
            y += 8;
            GAZCanvas.Text(10, card_info['EP'], new Vector2(offset.x + 43, y), 'rgb(0,0,0)', 'center', 'roboto', 'bold');
            GAZCanvas.Text(10, card_info['BP'], new Vector2(offset.x + 91, y), 'rgb(0,0,0)', 'center', 'roboto', 'bold');
            GAZCanvas.Text(10, card_info['FP'], new Vector2(offset.x + 138, y), 'rgb(0,0,0)', 'center', 'roboto', 'bold');
            GAZCanvas.Text(10, card_info['DP'], new Vector2(offset.x + 181, y), 'rgb(0,0,0)', 'center', 'roboto', 'bold');
            GAZCanvas.Text(10, card_info['HP'], new Vector2(offset.x + 226, y), 'rgb(0,0,0)', 'center', 'roboto', 'bold');
        }
    }
    
    draw()
    {
        this.view.on_draw_start();
        super.draw();
    }

    Run() {
        //do oneTimeInit once

        appInst.oneTimeInit();

        setInterval(function () {
            //on each frame ...
            GAZCanvas.update(60);

            Input.update();

            appInst.frameCount += 1;

            //do state machine update
            appInst.stateMachine.update();

            //clear screen for drawing
            Canvas.Rect(new Rect(0, 0, window.innerWidth, window.innerHeight), appInst.letterboxColour);

            //do state machine draw
            appInst.stateMachine.draw();

            //draw the letterbox over the screen to hide any overdraw
            GAZCanvas.drawLetterbox(appInst.letterboxColour);
        }, 17);
    }

}

appInst = new ARSINOEGame();

