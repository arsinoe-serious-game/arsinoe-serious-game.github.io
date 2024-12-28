/*
        EP - Economic protection
        BP - Bio (diversity) protection
        FP - Flood protection
        DP - Drought protection
        HP - Heat protection
     */

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


        //this.stateMachine.setState(GameState_SimpleGame.label());
        this.stateMachine.setState(GameState_InterventionPreview.label());

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
