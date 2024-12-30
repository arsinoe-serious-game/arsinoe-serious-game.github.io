//*********************************************************************************************************************
class GameState_Test extends StateMachineState
{
    static label()
    {
        return "GameState_Test";
    }

    constructor()
    {
        super();
    }

    init()
    {
        super.init();
    }

    update()
    {
        super.update();
    }

    draw()
    {
        super.draw();

        GAZCanvas.Rect(new Rect(0, 0, GAZCanvas.referenceScreenSize.w, GAZCanvas.referenceScreenSize.h),'#000000');
    }
}

//*********************************************************************************************************************
class GameState_InterventionPreview extends StateMachineState
{
    static label()
    {
        return "GameState_InterventionPreview";
    }

    constructor()
    {
        super();

        this.widget_list = {};
        this.first_intervention = 0;

        this.intervention_types = ['BP', 'FP','DP','HP'];
        this.current_intervention = 0;

    }

    on_interventon_button(b, step){
        if ((this.current_intervention + step >= 0) && (this.current_intervention+step < this.intervention_types.length)) {
            this.current_intervention += step;
        }

        this.widget_list['prev_intervention'].set_active(this.current_intervention > 0);
        this.widget_list['next_intervention'].set_active(this.current_intervention < this.intervention_types.length-1);


        let card_index = 0;
        for(let i=0;i < intervention_cards.length;i++) {

            if (intervention_cards[i]['type'] === this.intervention_types[this.current_intervention]) {
                this.widget_list['intervention_card_' + card_index.toString()].set_card_info(i);
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
        this.widget_list['prev_intervention'].label.font_family = 'roboto';
        this.widget_list['prev_intervention'].on_click = function (d) {
            self.on_interventon_button(d, -1);
        };

        loc = layout_get_by_name(template, 'button_next');

        this.widget_list['next_intervention'] = new ButtonBase(layer_to_rect(loc));
        this.widget_list['next_intervention'].set_active(true);
        this.widget_list['next_intervention'].set_label('NEXT');
        this.widget_list['next_intervention'].label.font_size = 24;
        this.widget_list['next_intervention'].label.font_family = 'roboto';
        this.widget_list['next_intervention'].on_click = function (d) {
            self.on_interventon_button(d, 1);
        };

        for(let i=0;i < 7;i++) {
            let loc = layout_get_by_name(template, 'card_' + i.toString());
            this.widget_list['intervention_card_' + i.toString()] = new InterventionCardWidget(new Rect(loc['offset'][0], loc['offset'][1], (4*400)/6, 400) );
        }

        this.on_interventon_button(undefined,0);
    }

    update()
    {
        super.update();

        for (const [key, value] of Object.entries(this.widget_list)) {
                this.widget_list[key].update();
        }
    }

    draw()
    {
        appInst.draw();
        super.draw();

        GAZCanvas.clip_start();
        //GAZCanvas.clip_rect(GAZCanvas.toScreenSpace(new Rect(10, 20, 800, 900)));

        GAZCanvas.clip_end();

        for (const [key, value] of Object.entries(this.widget_list)) {
            this.widget_list[key].draw();
        }


        appInst.draw_mouse_pointer();
    }
}

//*********************************************************************************************************************

class GameState_SimpleGame extends StateMachineState
{
    static label()
    {
        return "GameState_SimpleGame";
    }

    constructor()
    {
        super();

        this.mode = '';
    }

    setmode(mode){

        if (this.mode != mode) {
            this.mode = mode;

            switch (this.mode) {
                case 'init':
                    appInst.model.on_new_game();
                    for(let round=0;round < 4;round++){
                        console.log('Round:' + round.toString()+ ' of 4. deck size:' +appInst.model.current_deck.length.toString() +' Mayor:'+ appInst.model.current_mayor );

                        if (appInst.model.selected_interventions.length > 0) {
                            let text = 'Selected Interventions';
                            text +='\n';

                            for(let i=0;i< appInst.model.selected_interventions.length;i++) {
                                let card = appInst.model.selected_interventions[i];
                                text += '\t'+ appInst.model.card_to_string(appInst.model.get_intervention_card(card));
                                text +='\n';
                            }

                            let prot = appInst.model.get_protection();

                            text +='\tTotal Protection'.padEnd(41,' ');

                            for (const [key, value] of Object.entries(prot)) {
                                text += '  ' + key + ':' + prot[key].toString().padEnd(2, ' ');
                            }

                            text +='\n';

                            console.log(text);
                        }

                        let text = '';
                        text +='\n';
                        text += 'Current Intervention options';
                        text +='\n';



                        let current_options = appInst.model.get_round_cards();

                        for (let i=0;i< current_options.length;i++) {

                            let entry = current_options[i];

                            text += '\t' + (i + 1).toString() + '. ';

                            if (false) {
                                text += str(entry) + ' ';
                            }

                            let card = appInst.model.get_intervention_card(entry);
                            text += appInst.model.card_to_string(card);

                            text +='\n';
                        }

                        console.log(text);

                        let selected_intervention = appInst.model.random.getChoice(current_options);

                        console.log('You selected: ' + appInst.model.get_intervention_card(selected_intervention)['name']);

                        appInst.model.select_intervention(selected_intervention);

                        /*
                        let outcomes = {};
                        for(let i=0;i<100;i++){
                            let outcome = appInst.model.random.getChoice([1,2,3,4,5,6]);

                            if(!(outcome.toString() in outcomes)){
                                outcomes[outcome.toString()] = 0;
                            }
                            outcomes[outcome.toString()]+=1;
                        }

                        for (const [key, value] of Object.entries(outcomes)) {
                            console.log(key, outcomes[key].toString());
                        }
                        */

                        text = '';
                        //do response!
                        let outcome = appInst.model.random.getChoice([1,2,3,4,5,6]);
                        let outcome_response = appInst.model.get_intervention_card(selected_intervention)['outcome-bad'];

                        let have_an_election = false;

                        if (outcome == 1){
                            outcome_response = 'BAD:'+outcome_response +'\n' + 'The citizens demand a new mayor!';
                            have_an_election = true;
                        }

                        if (outcome >1 && outcome< 4 ){
                            outcome_response = 'OK:'+appInst.model.get_intervention_card(selected_intervention)['outcome-ok'];
                        }

                        if (outcome >3 && outcome< 6 ){
                            outcome_response = 'GOOD:'+appInst.model.get_intervention_card(selected_intervention)['outcome-good'];
                        }

                        if (outcome == 6){
                            outcome_response = 'GREAT:'+appInst.model.get_intervention_card(selected_intervention)['outcome-great'];
                        }

                        text = '\n';
                        text +='Implementation Outcome: ' + outcome.toString();
                        text +='\n';
                        text += outcome_response;
                        text +='\n';

                        console.log(text);

                        if (have_an_election){
                            text = '';

                            text +='Mayor: ' + appInst.model.current_mayor +' has been voted out';
                            text += '\n';

                            appInst.model.select_mayor();
                            text += appInst.model.current_mayor + ' is the new mayor';
                            text += '\n';

                            text += '\n';
                            console.log(text);

                        }

                    }
                    //do protection events
                    //appInst.model.selected_interventions = [0,1,2,3];

                    let prot = appInst.model.get_protection();

                    let text = '\n';
                    text += 'Overall protection';
                    text += '\n';

                    for(let i=0;i< appInst.model.selected_interventions.length;i++) {
                        let card = appInst.model.selected_interventions[i];
                        text += '\t'+ appInst.model.card_to_string(appInst.model.get_intervention_card(card));
                        text +='\n';
                    }

                    text +='\n';

                    for (const [key, value] of Object.entries(prot)) {
                        text += '\t' + key + ':' + prot[key].toString().padEnd(2, ' ');
                    }

                    console.log(text);

                    let events = {};
                    events['EP'] = {'name': 'Economic'};
                    events['BP'] = {'name': 'Biodiversity'};
                    events['FP'] = {'name': 'Flood'};
                    events['DP'] = {'name': 'Drought'};
                    events['HP'] = {'name': 'Heat Wave'};

                    text = '\n';

                    for (const [key, value] of Object.entries(events)) {
                        let severity = appInst.model.random.getChoice(['Minor', 'Average', 'Extreme']);

                        text += '\t';
                        text += ( severity + ' '+ events[key]['name'] + ' event!').padEnd(40, ' ');
                        text += 'resillience: ' + (prot[key]).toString() + ', ' + appInst.model.get_response(severity.toLowerCase(), prot[key]);
                        text +='\n';
                    }

                    console.log(text);



                    break;

                default:
                    console.log(this.mode +':unknown');
            }
        }
    }


    init()
    {
        super.init();
        this.setmode('init');
    }

    update()
    {
        super.update();

        switch (this.mode) {
            case 'init':
                break;

            default:
                console.log(this.mode +':unknown');
        }
    }

    draw()
    {
        super.draw();

        appInst.draw();

        switch (this.mode) {
            case 'init':
                break;

            default:
                console.log(this.mode +':unknown');
        }


        appInst.draw_mouse_pointer();
    }
}

//*********************************************************************************************************************

class GameState_TestModeBase extends StateMachineState{
    constructor()
    {
        super();

        this.widget_list = {};

    }

    init()
    {
        super.init();

        let self = this;

        let template = layout_get_by_name(layout,'screen_event_print');

        this.widget_list['To Testbed'] = new ButtonBase( new Rect(1600 - 120,10,100,30));
        this.widget_list['To Testbed'].set_active(true);
        this.widget_list['To Testbed'].set_label('Back');
        this.widget_list['To Testbed'].label.font_size = 24;
        this.widget_list['To Testbed'].label.font_family = 'roboto';
        this.widget_list['To Testbed'].on_click = function (d) {
            appInst.stateMachine.setState(GameState_Testbed.label());
        };
    }

    update()
    {
        super.update();

        for (const [key, value] of Object.entries(this.widget_list)) {
                this.widget_list[key].update();
        }
    }

    draw()
    {
        appInst.draw();
        super.draw();

        GAZCanvas.clip_start();
        //GAZCanvas.clip_rect(GAZCanvas.toScreenSpace(new Rect(10, 20, 800, 900)));

        GAZCanvas.clip_end();

        for (const [key, value] of Object.entries(this.widget_list)) {
            this.widget_list[key].draw();
        }

        appInst.draw_mouse_pointer();
    }
}

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
        if ((this.current_intervention + step >= 0) && (this.current_intervention+step < intervention_cards.length-1)) {
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

        let template = layout_get_by_name(layout,'screen_intervention_preview');

        this.widget_list['prev_intervention'] = new ButtonBase( layer_to_rect(layout_get_by_name(template,'button_prev')));
        this.widget_list['prev_intervention'].set_active(false);
        this.widget_list['prev_intervention'].set_label('PREV');
        this.widget_list['prev_intervention'].label.font_size = 24;
        this.widget_list['prev_intervention'].label.font_family = 'roboto';
        this.widget_list['prev_intervention'].on_click = function (d) {
            self.on_update_interventon(-1);
        };

        this.widget_list['next_intervention'] = new ButtonBase( layer_to_rect(layout_get_by_name(template,'button_next')));
        this.widget_list['next_intervention'].set_active(true);
        this.widget_list['next_intervention'].set_label('NEXT');
        this.widget_list['next_intervention'].label.font_size = 24;
        this.widget_list['next_intervention'].label.font_family = 'roboto';
        this.widget_list['next_intervention'].on_click = function (d) {
            self.on_update_interventon(1);
        };

        template = layout_get_by_name(layout,'screen_intervention_print');

        this.widget_list['intervention_card_0'] = new InterventionCardWidget(layer_to_rect(layout_get_by_name(template,'card_front')));
        this.widget_list['intervention_card_0'].init();

        this.widget_list['intervention_card_1'] = new InterventionCardWidget(layer_to_rect(layout_get_by_name(template,'card_back')));
        this.widget_list['intervention_card_1'].init();
        this.widget_list['intervention_card_1'].set_display('back');


        this.on_update_interventon(0);
    }
}

//*********************************************************************************************************************

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

        let template = layout_get_by_name(layout,'screen_intervention_preview');

        this.widget_list['prev_intervention'] = new ButtonBase( layer_to_rect(layout_get_by_name(template,'button_prev')));
        this.widget_list['prev_intervention'].set_active(false);
        this.widget_list['prev_intervention'].set_label('PREV');
        this.widget_list['prev_intervention'].label.font_size = 24;
        this.widget_list['prev_intervention'].label.font_family = 'roboto';
        this.widget_list['prev_intervention'].on_click = function (d) {
            self.on_update_interventon(-1);
        };

        this.widget_list['next_intervention'] = new ButtonBase( layer_to_rect(layout_get_by_name(template,'button_next')));
        this.widget_list['next_intervention'].set_active(true);
        this.widget_list['next_intervention'].set_label('NEXT');
        this.widget_list['next_intervention'].label.font_size = 24;
        this.widget_list['next_intervention'].label.font_family = 'roboto';
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
        this.widget_list['prev_intervention'].label.font_family = 'roboto';
        this.widget_list['prev_intervention'].on_click = function (d) {
            self.on_update_interventon(-1);
        };

        this.widget_list['next_intervention'] = new ButtonBase( layer_to_rect(layout_get_by_name(template,'button_next')));
        this.widget_list['next_intervention'].set_active(true);
        this.widget_list['next_intervention'].set_label('NEXT');
        this.widget_list['next_intervention'].label.font_size = 24;
        this.widget_list['next_intervention'].label.font_family = 'roboto';
        this.widget_list['next_intervention'].on_click = function (d) {
            self.on_update_interventon(1);
        };

        this.widget_list['intervention_card_0'] = new EventCardWidget(layer_to_rect(layout_get_by_name(template,'card_front')));
        this.widget_list['intervention_card_0'].init();

        this.widget_list['intervention_card_1'] = new EventCardWidget(layer_to_rect(layout_get_by_name(template,'card_back')));
        this.widget_list['intervention_card_1'].init();
        this.widget_list['intervention_card_1'].set_display('back');


        this.on_update_interventon(0);
    }

}

//*********************************************************************************************************************

class GameState_Testbed extends StateMachineState
{
    static label()
    {
        return "GameState_Test";
    }

    constructor()
    {
        super();
        this.widget_list = {};
    }

    init()
    {
        super.init();

        this.widget_list['View Personas'] = new ButtonBase( new Rect((1600-250)/2,100,250,100));
        this.widget_list['View Personas'].set_active(true);
        this.widget_list['View Personas'].set_label('View Persona Cards');
        this.widget_list['View Personas'].label.font_size = 24;
        this.widget_list['View Personas'].label.font_family = 'roboto';
        this.widget_list['View Personas'].on_click = function (d) {
            appInst.stateMachine.setState(GameState_PersonaPrint.label());
        };

        this.widget_list['View Intervention'] = new ButtonBase( new Rect((1600-250)/2,300,250,100));
        this.widget_list['View Intervention'].set_active(true);
        this.widget_list['View Intervention'].set_label('View Intervention Cards');
        this.widget_list['View Intervention'].label.font_size = 24;
        this.widget_list['View Intervention'].label.font_family = 'roboto';
        this.widget_list['View Intervention'].on_click = function (d) {
            appInst.stateMachine.setState(GameState_InterventionPrint.label());
        };

        this.widget_list['View Event'] = new ButtonBase( new Rect((1600-250)/2,500,250,100));
        this.widget_list['View Event'].set_active(true);
        this.widget_list['View Event'].set_label('View Event Cards');
        this.widget_list['View Event'].label.font_size = 24;
        this.widget_list['View Event'].label.font_family = 'roboto';
        this.widget_list['View Event'].on_click = function (d) {
            appInst.stateMachine.setState(GameState_EventPrint.label());
        };
    }

    update()
    {
        super.update();

        for (const [key, value] of Object.entries(this.widget_list)) {
                this.widget_list[key].update();
        }
    }

    draw()
    {
        super.draw();

        for (const [key, value] of Object.entries(this.widget_list)) {
            this.widget_list[key].draw();
        }

        GAZCanvas.Text(20,GAZCanvas.currentScreenSize.toString(),new Vector2(0,20),'rgb(255,255,255)', 'left', 'Roboto');

        appInst.draw_mouse_pointer();
    }
}

//*********************************************************************************************************************