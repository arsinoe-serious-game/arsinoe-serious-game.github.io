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

        this.heading_font_size = 20;
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
            floating_text.font_size = this.content_font_size * this.scale.y;
            floating_text.font_style = '';
            floating_text.font_family = 'roboto';
            floating_text.font_color = 'rgb(0,0,0)';


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
            floating_text.font_size = this.content_font_size * this.scale.y;
            floating_text.font_style = '';
            floating_text.font_family = 'roboto';
            floating_text.font_color = 'rgb(0,0,0)';


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
        floating_text.font_size = this.content_font_size * this.scale.y;
        floating_text.font_style = '';
        floating_text.font_family = 'roboto';
        floating_text.font_color = 'rgb(0,0,0)';


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
        floating_text.font_size = this.content_font_size * this.scale.y;
        floating_text.set_scale(this.scale);
        floating_text.set_offset(new Vector2(this.x, this.y));


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

    init(){
        super.init();

        this.arsinoe_logo = new LayerWidgetClickableImage(layout_get_by_name(this.template,'arsinoe_logo'));
        this.arsinoe_logo.set_scale(this.scale);
        this.arsinoe_logo.set_offset(new Vector2(this.x, this.y));
        this.arsinoe_logo.image = appInst.view.get_arsinoe_logo();

    }

    update() {
        super.update();

        if(this.arsinoe_logo.update() === true){
            window.open('https://arsinoe-project.eu/', '','location=yes,height=570,width=520,scrollbars=yes,status=yes');
        }
    }

    get_bg_col(){
        //heat
        if (this.card_info['type'] == 'HP'){
            return 'rgb(244,201,57)';
        }

        //bio
        if (this.card_info['type'] == 'BP'){
            return 'rgb(63,143,97)';
        }

        //drought
        if (this.card_info['type'] == 'DP'){
            return 'rgb(246,153,88)';
        }

        //flooding
        if (this.card_info['type'] == 'FP') {
            return 'rgb(107,128,221)';
        }

        return 'rgb(127,127,127)';
    }

    draw_front(){
        let loc = new Vector2(this.x, this.y);
        this.draw_bg(loc);
        let template = layout_get_by_name(this.template,'front');
        //this.debug_layer(loc, template);

        this.qr_code_link.draw(loc);
        this.arsinoe_logo.draw(loc);

        let heading_text = new LayerWidgetText(layout_get_by_name(template, 'header_text'));
        heading_text.current_color= 'rgb(0,0,0)';
        heading_text.font_style = 'bold';
        heading_text.font_just = 'center';
        heading_text.font_size = this.heading_font_size * this.scale.y;
        heading_text.set_scale(this.scale);
        heading_text.set_offset(new Vector2(this.x, this.y));

        heading_text.label = this.card_info['name'].toUpperCase();

        if (heading_text.label.length > 22){
            heading_text.offset.y -= (this.heading_font_size/2) * this.scale.y;
        }


        heading_text.draw();

        this.debug_image(loc, layout_get_by_name(template,'image_loc'),appInst.view.image_bank['interventions'][this.card_index] );

        let floating_text = new LayerWidgetText(layout_get_by_name(template, 'floating_text'));
        floating_text.current_color= 'rgb(0,0,0)';
        floating_text.label = this.card_info['desc'];
        floating_text.font_style = '';
        floating_text.font_just = 'left';
        floating_text.font_size = this.content_font_size * this.scale.y;
        floating_text.set_scale(this.scale);
        floating_text.set_offset(new Vector2(this.x, this.y));


        floating_text.draw();

        //do protection racket
        let headings = ['EP','BP','FP','DP','HP'];

        let pos = loc.clone();
        pos.y +=1*this.scale.y;

        let cols = [
            'rgb(88,39,120)',
            'rgb(63,143,97)',
            'rgb(107,128,221)',
            'rgb(246,153,88)',
            'rgb(244,201,57)',
        ];

        for(let i=0;i<5;i++) {
            let c = layout_get_by_name(template,'protection_table')['children']['p' + i.toString()];

            this.debug_rect(loc, c['children']['heading'], cols[i]);
            this.debug_rect(loc, c['children']['value'], 'rgb(210,210,210)');

            this.debug_text(pos, c['children']['heading'], 20, headings[i], 'rgba(255,255,255)', 'center', 'roboto', 'bold');
            this.debug_text(pos, c['children']['value'], 20, this.card_info[headings[i]], 'rgba(0,0,0)', 'center', 'roboto', 'bold');
        }
    }

    draw_back() {
        let loc = new Vector2(this.x, this.y);
        this.draw_bg(loc);

        let template = layout_get_by_name(this.template, 'back');

        //this.debug_layer(loc, template);

        let title = 'outcomes'.toUpperCase();

        this.debug_text(loc, layout_get_by_name(template, 'header_text'), 28 * this.scale.y, title, 'rgba(0,0,0)', 'center', 'roboto', 'bold');


        //do description
        let t = template['children']['floating_text'];
        let pos = new Vector2();

        pos.x = loc.x + (t['offset'][0]) * this.scale.x;
        pos.y = loc.y + (t['offset'][1]) * this.scale.y;

        pos.y += 10 * this.scale.y;

        let text_font_size = this.content_font_size * this.scale.y;

        //do outcomes
        pos.y += 7 * this.scale.y;
        pos.x = loc.x + (t['offset'][0] * this.scale.x);

        let dice = ['1: Oh Dear!', '2-3: Not Good', '4-5:Not Bad', '6:Great'];

        let floating_text = new LayerWidgetText(layout_get_by_name(template, 'floating_text'));
        floating_text.current_color= 'rgb(0,0,0)';
        floating_text.font_just = 'left';
        floating_text.font_size = this.content_font_size * this.scale.y;
        floating_text.set_scale(this.scale);
        floating_text.set_offset(new Vector2(this.x, this.y));


        floating_text.label = '';
        for (let p = 0; p < 4; p++) {
            floating_text.label += ' <b> ';
            floating_text.label += dice[p];
            floating_text.label += ' </b> ';
            floating_text.label += ' <br> ';

            floating_text.label +=this.card_info['outcome-' + (p).toString()];

            if (p == 0) {
                floating_text.label += ' <b> ';
                floating_text.label += 'The citizens demand a new mayor!';
                floating_text.label += ' </b> ';
            }

            floating_text.label += ' <br> ';
            floating_text.label += ' <br> ';
        }

        floating_text.draw();
    }
}
