class CardWidgetBase extends LayerWidget {
    constructor(inRect) {
        super(inRect);

        this.card_info = undefined;
        this.template_name = 'template_intervention_card';
        this.card_index = 0;
        this.card_set = undefined;
        this.card_set_name = undefined;
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

        this.side = 'front';

        this.heading_font_size = 20;
        this.content_font_size = 18;

        this.arsinoe_logo = new LayerWidgetClickableImage(layout_get_by_name(this.template,'arsinoe_logo'));
        this.arsinoe_logo.set_scale(this.scale);
        this.arsinoe_logo.set_offset(new Vector2(this.x, this.y));
        this.arsinoe_logo.image = appInst.view.get_arsinoe_logo();
    }

    set_display(side){
        this.side = side;
    }

    set_card_info(index) {
        this.card_index = index;
        this.card_info = this.card_set[this.card_index];

        this.qr_code_link.image = appInst.view.get_qrcode(this.card_set_name, this.card_index);
    }

    get_type_col(type_label){

        if (type_label == 'HP') {
            return 'rgb(244,201,57)';
        }

        //bio
        if (type_label == 'BP') {
            return 'rgb(63,143,97)';
        }

        //drought
        if (type_label == 'DP') {
            return 'rgb(246,153,88)';
        }

        //flooding
        if (type_label == 'FP') {
            return 'rgb(107,128,221)';
        }

        if (type_label == 'EP') {
            return 'rgb(195,155,230)';
        }

        return 'rgb(127,127,127)';
    }

    get_bg_col(){

        if('type' in this.card_info) {
            return this.get_type_col(this.card_info['type']);
        }

        return 'rgb(127,127,127)';
    }

    update() {
        super.update();
        if(this.qr_code_link.update() === true){
            window.open(this.card_info['local_url'], '','location=yes,height=570,width=520,scrollbars=yes,status=yes');
        }

        if(this.arsinoe_logo.update() === true){
            window.open('https://arsinoe-project.eu/', '','location=yes,height=570,width=520,scrollbars=yes,status=yes');
        }
    }

    draw_bg(loc){
        let r = layout_get_by_name(this.template,'bg');
        let c = this.get_bg_col();

        this.debug_rect(loc, r,c);
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

        this.card_set_name = 'events';
        this.card_set = appInst.model.get_event_cards();
    }

    draw_front() {
        let loc = new Vector2(this.x, this.y);
        this.draw_bg(loc);

        let template = layout_get_by_name(this.template,'front');
        //this.debug_layer(loc, template);

        this.qr_code_link.draw(loc);
        this.arsinoe_logo.draw(loc);


        let title = this.card_info['name'].toUpperCase();
        this.debug_text(loc, layout_get_by_name(template,'header_text'), this.heading_font_size*this.scale.y, title, 'rgba(0,0,0)', 'center', appInst.view.get_font_family(), 'bold');

        //right side
        {
            let floating_text = new LayerWidgetText(layout_get_by_name(this.template, 'right_floating_text'));
            floating_text.font_just = 'left';
            floating_text.font_size = this.content_font_size * this.scale.y;
            floating_text.font_style = '';
            floating_text.font_family = appInst.view.get_font_family();
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
            floating_text.font_family = appInst.view.get_font_family();
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

        this.debug_image(loc,layout_get_by_name(template,'image_loc'), appInst.view.get_card_image(this.card_set_name,this.card_index) , false);
    }

    draw_back() {
        super.draw_back();
        let loc = new Vector2(this.x, this.y);
        this.draw_bg(loc);

        let template = layout_get_by_name(this.template,'back');
        //this.debug_layer(loc, template);

        //this.qr_code_link.draw(loc);
        //this.arsinoe_logo.draw(loc);

        let cws_logo = new LayerWidgetClickableImage(layout_get_by_name(this.template,'arsinoe_logo'));
        cws_logo.set_scale(this.scale);
        cws_logo.set_offset(new Vector2(this.x, this.y));
        cws_logo.image = appInst.view.get_image('cws_logo');
        cws_logo.draw();

        let cws_qr = new LayerWidgetClickableImage(layout_get_by_name(this.template,'qr_code'));
        cws_qr.set_scale(this.scale);
        cws_qr.set_offset(new Vector2(this.x, this.y));
        cws_qr.image = appInst.view.get_image('cws_qr');
        cws_qr.draw();


        let title = this.card_info['outcome-heading'].toUpperCase();
        this.debug_text(loc, layout_get_by_name(template,'header_text'), this.heading_font_size*this.scale.y, title, 'rgba(0,0,0)', 'center', appInst.view.get_font_family(), 'bold');


        let floating_text = new LayerWidgetText(layout_get_by_name(this.template, 'floating_text'));
        floating_text.font_just = 'left';
        floating_text.font_size = this.content_font_size * this.scale.y;
        floating_text.font_style = '';
        floating_text.font_family = appInst.view.get_font_family();
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

        //h2020 text
        floating_text = new LayerWidgetText(layout_get_by_name(this.template, 'h2020_text'));
        floating_text.font_just = 'left';
        floating_text.font_size = 12 * this.scale.y;
        floating_text.font_style = '';
        floating_text.font_family = appInst.view.get_font_family();
        floating_text.font_color = 'rgb(0,0,0)';


        floating_text.set_scale(this.scale);
        floating_text.set_offset(new Vector2(this.x, this.y));

        floating_text.label = appInst.model.get_game_text('H2020_HEADER');
        floating_text.draw();

        let eu_flag = new LayerWidgetClickableImage(layout_get_by_name(this.template,'eu_flag'));
        eu_flag.set_scale(this.scale);
        eu_flag.set_offset(new Vector2(this.x, this.y));
        eu_flag.image = appInst.view.get_image('eu_logo');

        eu_flag.draw();
    }
}

class PersonaCardWidget extends CardWidgetBase{
    constructor(inRect) {
        super(inRect);

        this.template_name = 'template_persona_card';
        this.card_set = appInst.model.get_persona_cards();
        this.card_set_name = 'personas';
    }

    draw_front(){
        let loc = new Vector2(this.x, this.y);
        this.draw_bg(loc);

        let template = layout_get_by_name(this.template,'front');
        this.qr_code_link.draw(loc);
        this.arsinoe_logo.draw(loc);


        let title = this.card_info['name'].toUpperCase();

        let max_line_length = 22;

        if (title.length > max_line_length) {
            this.debug_text(new Vector2(loc.x,loc.y-((this.heading_font_size/2)*this.scale.y) ), template['children']['header_text'], this.heading_font_size, this.format_desc(title, max_line_length), 'rgba(0,0,0)', 'center', appInst.view.get_font_family(), 'bold');
        }else {
            this.debug_text(loc, layout_get_by_name(template,'header_text'), this.heading_font_size, title, 'rgba(0,0,0)', 'center', appInst.view.get_font_family(), 'bold');
        }

        this.debug_image(loc, layout_get_by_name(template,'image_loc'),appInst.view.get_card_image(this.card_set_name,this.card_index) );

        let floating_text = new LayerWidgetText(layout_get_by_name(template, 'floating_text'));
        floating_text.current_color= 'rgb(0,0,0)';
        floating_text.label = this.card_info['desc'];
        floating_text.font_style = '';
        floating_text.font_just = 'left';
        floating_text.font_size = this.content_font_size * this.scale.y;
        floating_text.set_scale(this.scale);
        floating_text.set_offset(new Vector2(this.x, this.y));


        floating_text.draw();
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
        this.card_set_name = 'interventions';
    }

    init(){
        super.init();
    }

    update() {
        super.update();
    }

    print_heading_text(template, label, max_width=22){
        let heading_text = new LayerWidgetText(layout_get_by_name(template, 'header_text'));
        heading_text.current_color= 'rgb(0,0,0)';
        heading_text.font_style = 'bold';
        heading_text.font_just = 'center';
        heading_text.font_size = (this.heading_font_size-1) * this.scale.y;
        heading_text.set_scale(this.scale);
        heading_text.set_offset(new Vector2(this.x, this.y));

        heading_text.label = label.toUpperCase();

        let result = heading_text.get_printing_extents();

        if (result.h > heading_text.font_size){
            let lines = Math.floor((result.h+0.5) / heading_text.font_size);

            if(lines ===2) {
                heading_text.offset.y -= heading_text.font_size/2;
            }

            if(lines ===3) {
                heading_text.offset.y -= heading_text.font_size * 1.5;
            }
        }

        heading_text.draw();

    }


    draw_front(){
        let loc = new Vector2(this.x, this.y);
        this.draw_bg(loc);
        let template = layout_get_by_name(this.template,'front');
        //this.debug_layer(loc, template);

        this.qr_code_link.draw(loc);
        this.arsinoe_logo.draw(loc);

        this.print_heading_text(template, this.card_info['name'].toUpperCase());

        this.debug_image(loc, layout_get_by_name(template,'image_loc'), appInst.view.get_card_image(this.card_set_name,this.card_index),  );


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

        for(let i=0;i<5;i++) {
            let c = layout_get_by_name(template,'protection_table')['children']['p' + i.toString()];

            this.debug_rect(loc, c['children']['heading'], this.get_type_col(headings[i]), '#000000');
            this.debug_rect(loc, c['children']['value'], 'rgb(210,210,210)', '#000000');

            this.debug_text(pos, c['children']['heading'], 20, headings[i], 'rgba(255,255,255)', 'center', appInst.view.get_font_family(), 'bold');
            this.debug_text(pos, c['children']['value'], 20, this.card_info[headings[i]], 'rgba(0,0,0)', 'center', appInst.view.get_font_family(), 'bold');
        }
    }

    draw_back() {
        let loc = new Vector2(this.x, this.y);
        this.draw_bg(loc);

        let template = layout_get_by_name(this.template, 'back');

        //this.debug_layer(loc, template);
        this.print_heading_text(template, this.card_info['outcome-heading'].toUpperCase(),25);

        //do description
        let t = template['children']['floating_text'];
        let pos = new Vector2();

        pos.x = loc.x + (t['offset'][0]) * this.scale.x;
        pos.y = loc.y + (t['offset'][1]) * this.scale.y;

        pos.y += 10 * this.scale.y;

        //do outcomes
        pos.y += 7 * this.scale.y;
        pos.x = loc.x + (t['offset'][0] * this.scale.x);

        let dice = ['1: Oh Dear!', '2-3: Not Good', '4-5:Not Bad', '6:Great'];

        let floating_text = new LayerWidgetText(layout_get_by_name(template, 'floating_text'));
        floating_text.current_color= 'rgb(0,0,0)';
        floating_text.font_just = 'left';
        floating_text.font_size = (this.content_font_size-1) * this.scale.y;
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

        //h2020 text
        floating_text = new LayerWidgetText(layout_get_by_name(this.template, 'h2020_text'));
        floating_text.font_just = 'left';
        floating_text.font_size = 12 * this.scale.y;
        floating_text.font_style = '';
        floating_text.font_family = appInst.view.get_font_family();
        floating_text.font_color = 'rgb(0,0,0)';


        floating_text.set_scale(this.scale);
        floating_text.set_offset(new Vector2(this.x, this.y));

        floating_text.label = appInst.model.get_game_text('H2020_HEADER');
        floating_text.draw();

        let eu_flag = new LayerWidgetClickableImage(layout_get_by_name(this.template,'eu_flag'));
        eu_flag.set_scale(this.scale);
        eu_flag.set_offset(new Vector2(this.x, this.y));
        eu_flag.image = appInst.view.get_image('eu_logo');

        eu_flag.draw();

        let cws_logo = new LayerWidgetClickableImage(layout_get_by_name(this.template,'arsinoe_logo'));
        cws_logo.set_scale(this.scale);
        cws_logo.set_offset(new Vector2(this.x, this.y));
        cws_logo.image = appInst.view.get_image('cws_logo');
        cws_logo.draw();

        let cws_qr = new LayerWidgetClickableImage(layout_get_by_name(this.template,'qr_code'));
        cws_qr.set_scale(this.scale);
        cws_qr.set_offset(new Vector2(this.x, this.y));
        cws_qr.image = appInst.view.get_image('cws_qr');
        cws_qr.draw();

    }
}
