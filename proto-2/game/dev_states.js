class GameState_InterventionPreview extends GameState_TestModeBase
{
    static label()
    {
        return "GameState_InterventionPreview";
    }

    constructor()
    {
        super();

        this.widget_list = {};

        this.intervention_types = [ 'FP','DP','HP', 'BP'];
        this.current_intervention = 0;

    }

    on_interventon_button(b, step){
        if ((this.current_intervention + step >= 0) && (this.current_intervention+step < this.intervention_types.length)) {
            this.current_intervention += step;
        }

        this.widget_list['prev_intervention'].set_active(this.current_intervention > 0);
        this.widget_list['next_intervention'].set_active(this.current_intervention < this.intervention_types.length-1);


        for(let i=0;i < 7;i++) {
            this.widget_list['intervention_card_' + i.toString()].visible = false;
        }

        let card_index = 0;
        for(let i=0;i < appInst.model.get_intervention_cards().length;i++) {

            if (appInst.model.get_intervention_cards()[i]['type'] === this.intervention_types[this.current_intervention]) {
                this.widget_list['intervention_card_' + card_index.toString()].set_card_info(i);
                this.widget_list['intervention_card_' + card_index.toString()].visible = true;
                card_index += 1;
            }
        }
    }

    init()
    {
        super.init();

        let self = this;

        let template = layout_get_by_name(layout, 'screen_intervention_preview');

        let loc = layout_get_by_name(template, 'button_prev');

        this.widget_list['prev_intervention'] = new ButtonBase(layer_to_rect(loc));
        this.widget_list['prev_intervention'].set_active(false);
        this.widget_list['prev_intervention'].set_label('PREV');
        this.widget_list['prev_intervention'].label.font_size = 24;
        this.widget_list['prev_intervention'].label.font_family = appInst.view.get_font_family();
        this.widget_list['prev_intervention'].on_click = function (d) {
            self.on_interventon_button(d, -1);
        };

        loc = layout_get_by_name(template, 'button_next');

        this.widget_list['next_intervention'] = new ButtonBase(layer_to_rect(loc));
        this.widget_list['next_intervention'].set_active(true);
        this.widget_list['next_intervention'].set_label('NEXT');
        this.widget_list['next_intervention'].label.font_size = 24;
        this.widget_list['next_intervention'].label.font_family = appInst.view.get_font_family();
        this.widget_list['next_intervention'].on_click = function (d) {
            self.on_interventon_button(d, 1);
        };

        for(let i=0;i < 7;i++) {
            let loc = layout_get_by_name(template, 'card_' + i.toString());
            //this.widget_list['intervention_card_' + i.toString()] = new InterventionCardWidget(new Rect(loc['offset'][0], loc['offset'][1], (4*400)/6, 400) );
            this.widget_list['intervention_card_' + i.toString()] = new InterventionCardWidget(layer_to_rect(loc) );
            this.widget_list['intervention_card_' + i.toString()].init();
        }

        this.on_interventon_button(undefined,0);
    }

    client_update() {
        super.client_update();
    }

    client_draw()
    {
        GAZCanvas.clip_start();
        //GAZCanvas.clip_rect(GAZCanvas.toScreenSpace(new Rect(10, 20, 800, 900)));

        GAZCanvas.clip_end();

        for (const [key, value] of Object.entries(this.widget_list)) {
            this.widget_list[key].draw();
        }
    }
}
//*********************************************************************************************************************

class GameState_InterventionPrint extends GameState_TestModeBase
{
    static label()
    {
        return "GameState_InterventionPrint";
    }

    constructor()
    {
        super();

        this.first_intervention = 0;
        this.intervention_types = ['BP', 'FP','DP','HP'];
        this.current_intervention = 0;

    }

    on_update_interventon(step){
        let intervention_cards = appInst.model.get_intervention_cards();
        if ((this.current_intervention + step >= 0) && (this.current_intervention+step < intervention_cards.length)) {
            this.current_intervention += step;
        }

        this.widget_list['prev_intervention'].set_active(this.current_intervention > 0);
        this.widget_list['next_intervention'].set_active(this.current_intervention < intervention_cards.length-1);

        this.widget_list['intervention_card_0'].set_card_info(this.current_intervention);
        this.widget_list['intervention_card_1'].set_card_info(this.current_intervention);
    }

    init()
    {
        super.init();
        this.current_intervention = 0;

        let self = this;

        let template = layout_get_by_name(layout,'screen_intervention_print');

        this.widget_list['bg2'] = new LayerWidgetRect( layout_get_by_name(template,'bg2'));
        this.widget_list['bg2'].current_color = 'rgb(127,127,127)';
        this.widget_list['bg'] = new LayerWidgetRect( layout_get_by_name(template,'bg'));
        this.widget_list['bg'].current_color = 'rgb(255,255,255)';
        this.widget_list['bg'].draw_outline = false;

        this.widget_list['prev_intervention'] = new ButtonBase( layer_to_rect(layout_get_by_name(template,'button_prev')));
        this.widget_list['prev_intervention'].set_active(false);
        this.widget_list['prev_intervention'].set_label('PREV');
        this.widget_list['prev_intervention'].label.font_size = 24;
        this.widget_list['prev_intervention'].label.font_family = appInst.view.get_font_family();
        this.widget_list['prev_intervention'].on_click = function (d) {
            self.on_update_interventon(-1);
        };

        this.widget_list['next_intervention'] = new ButtonBase( layer_to_rect(layout_get_by_name(template,'button_next')));
        this.widget_list['next_intervention'].set_active(true);
        this.widget_list['next_intervention'].set_label('NEXT');
        this.widget_list['next_intervention'].label.font_size = 24;
        this.widget_list['next_intervention'].label.font_family = appInst.view.get_font_family();
        this.widget_list['next_intervention'].on_click = function (d) {
            self.on_update_interventon(1);
        };

        this.widget_list['intervention_card_0'] = new InterventionCardWidget(layer_to_rect(layout_get_by_name(template,'card_front')));
        this.widget_list['intervention_card_0'].init();

        this.widget_list['intervention_card_1'] = new InterventionCardWidget(layer_to_rect(layout_get_by_name(template,'card_back')));
        this.widget_list['intervention_card_1'].init();
        this.widget_list['intervention_card_1'].set_display('back');


        this.on_update_interventon(0);
    }
}

//*********************************************************************************************************************

class GameState_EventPrint extends GameState_TestModeBase
{
    static label()
    {
        return "GameState_EventPrint";
    }

    constructor()
    {
        super();

        this.current_intervention = 0;

    }


    on_update_interventon(step){
        let event_cards = appInst.model.get_event_cards();

        if ((this.current_intervention + step >= 0) && (this.current_intervention+step < event_cards.length)) {
            this.current_intervention += step;
        }

        this.widget_list['prev_intervention'].set_active(this.current_intervention > 0);
        this.widget_list['next_intervention'].set_active(this.current_intervention < event_cards.length-1);

        this.widget_list['intervention_card_0'].set_card_info(this.current_intervention);
        this.widget_list['intervention_card_1'].set_card_info(this.current_intervention);
    }

    init()
    {
        super.init();
        this.current_intervention = 0;

        let self = this;

        let template = layout_get_by_name(layout,'screen_event_print');

        this.widget_list['prev_intervention'] = new ButtonBase( layer_to_rect(layout_get_by_name(template,'button_prev')));
        this.widget_list['prev_intervention'].set_active(false);
        this.widget_list['prev_intervention'].set_label('PREV');
        this.widget_list['prev_intervention'].label.font_size = 24;
        this.widget_list['prev_intervention'].label.font_family = appInst.view.get_font_family();
        this.widget_list['prev_intervention'].on_click = function (d) {
            self.on_update_interventon(-1);
        };

        this.widget_list['next_intervention'] = new ButtonBase( layer_to_rect(layout_get_by_name(template,'button_next')));
        this.widget_list['next_intervention'].set_active(true);
        this.widget_list['next_intervention'].set_label('NEXT');
        this.widget_list['next_intervention'].label.font_size = 24;
        this.widget_list['next_intervention'].label.font_family = appInst.view.get_font_family();
        this.widget_list['next_intervention'].on_click = function (d) {
            self.on_update_interventon(1);
        };

        this.widget_list['intervention_card_0'] = new EventCardWidget(layout_get_by_name(template,'card_front'));
        this.widget_list['intervention_card_0'].init();

        this.widget_list['intervention_card_1'] = new EventCardWidget(layout_get_by_name(template,'card_back'));
        this.widget_list['intervention_card_1'].init();
        this.widget_list['intervention_card_1'].set_display('back');


        this.on_update_interventon(0);
    }
}

//*********************************************************************************************************************

class GameState_PersonaPrint extends GameState_TestModeBase
{
    static label()
    {
        return "GameState_PersonaPrint";
    }

    constructor()
    {
        super();

        this.first_intervention = 0;
        this.current_intervention = 0;

    }

    on_update_interventon(step){

        let persona_cards = appInst.model.get_persona_cards();

        if ((this.current_intervention + step >= 0) && (this.current_intervention+step < persona_cards.length)) {
            this.current_intervention += step;
        }

        this.widget_list['prev_intervention'].set_active(this.current_intervention > 0);
        this.widget_list['next_intervention'].set_active(this.current_intervention < persona_cards.length-1);

        this.widget_list['intervention_card_0'].set_card_info(this.current_intervention);
        this.widget_list['intervention_card_1'].set_card_info(this.current_intervention);
    }

    init()
    {
        super.init();

        let self = this;
        this.current_intervention = 0;

        this.widget_list = {};

        let template = layout_get_by_name(layout,'screen_intervention_preview');

        this.widget_list['prev_intervention'] = new ButtonBase( layer_to_rect(layout_get_by_name(template,'button_prev')));
        this.widget_list['prev_intervention'].set_active(false);
        this.widget_list['prev_intervention'].set_label('PREV');
        this.widget_list['prev_intervention'].label.font_size = 24;
        this.widget_list['prev_intervention'].label.font_family = appInst.view.get_font_family();
        this.widget_list['prev_intervention'].on_click = function (d) {
            self.on_update_interventon(-1);
        };

        this.widget_list['next_intervention'] = new ButtonBase( layer_to_rect(layout_get_by_name(template,'button_next')));
        this.widget_list['next_intervention'].set_active(true);
        this.widget_list['next_intervention'].set_label('NEXT');
        this.widget_list['next_intervention'].label.font_size = 24;
        this.widget_list['next_intervention'].label.font_family = appInst.view.get_font_family();
        this.widget_list['next_intervention'].on_click = function (d) {
            self.on_update_interventon(1);
        };

        template = layout_get_by_name(layout,'screen_intervention_print');

        this.widget_list['intervention_card_0'] = new PersonaCardWidget(layer_to_rect(layout_get_by_name(template,'card_front')));
        this.widget_list['intervention_card_0'].init();

        this.widget_list['intervention_card_1'] = new PersonaCardWidget(layer_to_rect(layout_get_by_name(template,'card_back')));
        this.widget_list['intervention_card_1'].init();
        this.widget_list['intervention_card_1'].set_display('back');


        this.on_update_interventon(0);
    }
}

//*********************************************************************************************************************
class GameState_AllInterventionPreview extends GameState_TestModeBase
{
    static label()
    {
        return "GameState_AllInterventionPreview";
    }

    constructor()
    {
        super();

        this.widget_list = {};

        this.intervention_types = [ 'FP','DP','HP', 'BP'];
        this.current_intervention = 0;

    }

    init()
    {
        super.init();

        let self = this;

        let template = layout_get_by_name(layout, 'screen_all_intervention_preview');

        for(let type = 0;type < this.intervention_types.length;type++) {

            let card_index = 0;
            for(let i=0;i < appInst.model.get_intervention_cards().length;i++) {
                if (appInst.model.get_intervention_cards()[i]['type'] === this.intervention_types[type]) {
                    let b = new InterventionCardWidget(layer_to_rect(layout_get_by_name(layout_get_by_name(template, 'row_'+type.toString()), 'card_'+ card_index.toString())));
                    b.init();
                    b.visible = true;
                    b.set_card_info(i);

                    this.widget_list['card_'+this.intervention_types[type].toString() +'_'+card_index.toString()] = b;
                    card_index += 1;
                }
            }
        }

    }

    client_update() {
        super.client_update();
    }

    client_draw()
    {
        GAZCanvas.clip_start();
        //GAZCanvas.clip_rect(GAZCanvas.toScreenSpace(new Rect(10, 20, 800, 900)));

        GAZCanvas.clip_end();

        for (const [key, value] of Object.entries(this.widget_list)) {
            this.widget_list[key].draw();
        }
    }
}