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

        let button_width = 300;

        this.widget_list['View Personas'] = new ButtonBase( new Rect((1600-button_width)/2,100,button_width,100));
        this.widget_list['View Personas'].set_active(true);
        this.widget_list['View Personas'].set_label('View Persona Cards');
        this.widget_list['View Personas'].label.font_size = 24;
        this.widget_list['View Personas'].label.font_family = 'roboto';
        this.widget_list['View Personas'].on_click = function (d) {
            appInst.stateMachine.setState(GameState_PersonaPrint.label());
        };

        this.widget_list['View Intervention'] = new ButtonBase( new Rect((1600-button_width)/2,300,button_width,100));
        this.widget_list['View Intervention'].set_active(true);
        this.widget_list['View Intervention'].set_label('View Intervention Cards');
        this.widget_list['View Intervention'].label.font_size = 24;
        this.widget_list['View Intervention'].label.font_family = 'roboto';
        this.widget_list['View Intervention'].on_click = function (d) {
            appInst.stateMachine.setState(GameState_InterventionPrint.label());
        };

        this.widget_list['View Event'] = new ButtonBase( new Rect((1600-button_width)/2,500,button_width,100));
        this.widget_list['View Event'].set_active(true);
        this.widget_list['View Event'].set_label('View Event Cards');
        this.widget_list['View Event'].label.font_size = 24;
        this.widget_list['View Event'].label.font_family = 'roboto';
        this.widget_list['View Event'].on_click = function (d) {
            appInst.stateMachine.setState(GameState_EventPrint.label());
        };

        this.widget_list['Play Game'] = new ButtonBase( new Rect((1600-button_width)/2,700,button_width,100));
        this.widget_list['Play Game'].set_active(true);
        this.widget_list['Play Game'].set_label('Play Game');
        this.widget_list['Play Game'].label.font_size = 24;
        this.widget_list['Play Game'].label.font_family = 'roboto';
        this.widget_list['Play Game'].on_click = function (d) {
            appInst.stateMachine.setState(GameState_SelectPlayers.label());
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

        this.quit_modal = undefined;
        this.quit_button = undefined;
        this.mode = 'normal';

        this.widget_list = {};
    }

    init()
    {
        super.init();
        this.widget_list = {};


        let self = this;

        let template = layout_get_by_name(layout,'template_screen_layout');

        this.quit_modal = new LayerModal(layout_get_by_name(layout,'template_modal'));
        this.quit_modal.set_text('Quit Game', 'Are you sure?');

        this.quit_button = new LayerWidgetButton(layout_get_by_name(template,'quit_button'));
        this.quit_button.set_label('Quit');

        this.mode = 'normal';
    }

    client_update(){

        if(this.widget_list !== undefined) {
            for (const [key, value] of Object.entries(this.widget_list)) {
                value.update();
            }
        }
    }

    client_draw() {
        if(this.widget_list !== undefined) {
            for (const [key, value] of Object.entries(this.widget_list)) {
                value.draw();
            }
        }
    }


    update()
    {
        super.update();

        if (this.mode === 'normal') {
            if(this.quit_button.update() === true){
                this.mode = 'modal';
            }else{
                this.client_update();
            }
        }else{
            switch(this.quit_modal.update()){
                case 1:
                    appInst.stateMachine.setState(GameState_Testbed.label());
                    break;

                case -1:
                    this.mode = 'normal';
                    break;
            }
        }
    }

    draw()
    {
        appInst.draw();
        super.draw();

        GAZCanvas.clip_start();
        //GAZCanvas.clip_rect(GAZCanvas.toScreenSpace(new Rect(10, 20, 800, 900)));

        GAZCanvas.clip_end();

        this.client_draw();

        this.quit_button.draw();

        if(this.mode === 'modal'){
            this.quit_modal.draw();
        }


        appInst.draw_mouse_pointer();
    }
}
//*********************************************************************************************************************

class GameState_PlayGame extends GameState_TestModeBase
{
    constructor() {
        super();
    }
    static label()
    {
        return "GameState_PlayGame";
    }


    init()
    {
        super.init();
        appInst.on_new_game();
        appInst.controller.set_players(5);
        appInst.controller.select_mayor();

        console.log();
    }

    update() {
        super.update();
    }

    draw() {
        super.draw();
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

/*
    modes:
        - init
        - select players
        - select mayor
        - intervention stage
            - choose intervention
            - show outcome
            - (select mayor again)
        - event stage
            - show event
        - final outcome
*/

//*********************************************************************************************************************
class GameState_SelectPlayers extends GameState_TestModeBase
{
    constructor() {
        super();
    }
    static label()
    {
        return "GameState_SelectPlayers";
    }

    init()
    {
        super.init();
        appInst.on_new_game();

        let layer = layout_get_by_name(layout,'screen_choose_players');

        this.bg = new LayerWidgetRect(layout_get_by_name(layer, 'bg'));
        this.bg.current_color = 'rgb(255,255,255)';

        //heading
        this.heading_text = new LayerWidgetText(layout_get_by_name(layer, 'heading_text'));
        this.heading_text.current_color= 'rgb(0,0,0)';
        this.heading_text.label = 'Select Number of Players';

        //1-7 players
        this.player_button = [];

        for(let i=1;i <7;i++){
            let b = new LayerWidgetButton(layout_get_by_name(layer, 'player_'+i.toString()));
            b.button_text.label = i.toString();
            this.player_button.push(b);
        }
    }

    client_update(){

        for(let i = 0;i<this.player_button.length;i++){
            if (this.player_button[i].update() == 1){
                appInst.controller.set_players(i+1);
                appInst.stateMachine.setState(GameState_ViewPlayers.label());
            }
        }
    }


    client_draw() {
        this.bg.draw();
        this.heading_text.draw();

        for(let i = 0;i<this.player_button.length;i++){
            this.player_button[i].draw();
        }
    }
}

//*********************************************************************************************************************
class GameState_ViewPlayers extends GameState_TestModeBase
{
    constructor() {
        super();
    }
    static label()
    {
        return "GameState_ViewPlayers";
    }

    init()
    {
        super.init();

        let layer = layout_get_by_name(layout,'screen_view_players');

        this.bg = new LayerWidgetRect(layout_get_by_name(layer, 'bg'));
        this.bg.current_color = 'rgb(255,255,255)';

        //heading
        this.heading_text = new LayerWidgetText(layout_get_by_name(layer, 'heading_text'));
        this.heading_text.current_color= 'rgb(0,0,0)';
        this.heading_text.label = 'Your Personas';

        //1-7 players
        this.player_button = [];

        for(let i=1;i <8;i++){
            let b = new LayerWidgetButton(layout_get_by_name(layer, 'player_'+i.toString()));
            b.visible = false;
            this.player_button.push(b);
        }

        for(let i=0;i< appInst.model.players.length;i++){
            this.player_button[i].visible = true;
            this.player_button[i].set_label(appInst.model.get_persona_cards()[appInst.model.players[i]]['name']);
        }

        this.continue_button = new LayerWidgetButton(layout_get_by_name(layer,'button_ok'));
        this.continue_button.set_label('Continue');

    }

    client_update(){

        if (this.continue_button.update()){
            //set-up for interventions
            appInst.controller.setup_for_interventions();
            appInst.stateMachine.setState(GameState_MayoralElection.label());
        }
    }

    client_draw() {
        this.bg.draw();
        this.heading_text.draw();

        for(let i = 0;i<this.player_button.length;i++){
            this.player_button[i].draw();
        }

        this.continue_button.draw();
    }
}

//*********************************************************************************************************************
class GameState_MayoralElection extends GameState_TestModeBase
{
    constructor() {
        super();
    }
    static label()
    {
        return "GameState_MayoralElection";
    }

    init()
    {
        super.init();

        appInst.controller.select_mayor();

        let layer = layout_get_by_name(layout,'screen_mayoral_election');

        this.debug_layers = new LayerWidgetBase(layer);

        this.bg = new LayerWidgetRect(layout_get_by_name(layer, 'bg'));
        this.bg.current_color = 'rgb(255,255,255)';

        //heading
        this.heading_text = new LayerWidgetText(layout_get_by_name(layer, 'heading_text'));
        this.heading_text.current_color= 'rgb(0,0,0)';
        this.heading_text.label = 'Mayoral results';

        //player_name text
        this.player_text = new LayerWidgetText(layout_get_by_name(layer, 'player_name'));
        this.player_text.current_color= 'rgb(0,0,0)';
        this.player_text.label = 'Player:' + appInst.model.current_mayor.toString();


        //player_card
        this.player_card = new PersonaCardWidget(layer_to_rect(layout_get_by_name(layer, 'mayor_persona')));
        this.player_card.init();
        this.player_card.set_card_info(appInst.model.players[appInst.model.current_mayor]);

        //mayor text
        this.mayor_text = new LayerWidgetText(layout_get_by_name(layer, 'mayor_text'));
        this.mayor_text.current_color= 'rgb(0,0,0)';
        this.mayor_text.label = 'blah blah blah';

        //continue
        this.continue_button = new LayerWidgetButton(layout_get_by_name(layer,'button_ok'));
        this.continue_button.set_label('Continue');

    }

    client_update(){

        if (this.continue_button.update()){
            appInst.stateMachine.setState(GameState_ChooseIntervention.label());
        }

        this.player_card.update();
    }

    client_draw() {

        this.bg.draw();

        this.debug_layers.draw();

        this.heading_text.draw();
        this.player_text.draw();
        this.mayor_text.draw();

        this.player_card.draw();

        this.continue_button.draw();
    }

}

//*********************************************************************************************************************
class GameState_ChooseIntervention extends GameState_TestModeBase
{
    constructor() {
        super();
    }
    static label()
    {
        return "GameState_ChooseIntervention";
    }

    init()
    {
        super.init();
        let layer = layout_get_by_name(layout,'screen_intervention_select');

        this.bg = new LayerWidgetRect(layout_get_by_name(layer, 'bg'));
        this.bg.current_color = 'rgb(255,255,255)';

        //heading
        this.heading_text = new LayerWidgetText(layout_get_by_name(layer, 'heading_text'));
        this.heading_text.current_color= 'rgb(0,0,0)';
        this.heading_text.label = 'Intervention Selection Round ' + (appInst.model.current_intervention_round+1).toString() +' of 4';

        this.round_cards = appInst.controller.get_round_cards();

        //interventions
        this.intervention_cards = [];
        this.intervention_buttons = [];
        for(let i=0;i<4;i++){
            let card = new InterventionCardWidget(layer_to_rect(layout_get_by_name(layer, 'intervention_'+(i+1).toString())));
            card.init();
            card.set_card_info(this.round_cards[i]);

            this.intervention_cards.push(card);

            let button = new LayerWidgetButton(layout_get_by_name(layer,'button_select_' +(i+1).toString()));
            button.set_label('Select this intervention');

            this.intervention_buttons.push(button);
        }

        this.selected_interventions = [];


        this.selected_intervention_heading_text = new LayerWidgetText(layout_get_by_name(layer, 'selected_intervention_heading_text') );
        this.selected_intervention_heading_text.label = 'Selected Interventions';
        this.selected_intervention_heading_text.visible = appInst.model.selected_interventions.length > 0;


        for(let i=0;i<appInst.model.selected_interventions.length;i++){
            let card = new InterventionCardWidget(layer_to_rect(layout_get_by_name(layer, 'selected_intervention_'+(i+1).toString())));
            card.init();
            card.set_card_info(appInst.model.selected_interventions[i]);

            this.selected_interventions.push(card);
        }
    }

    client_update(){
        for(let i=0;i<4;i++){
            if(this.intervention_buttons[i].update() === true){
                //select intervention
                appInst.controller.select_intervention(this.round_cards[i]);
                appInst.stateMachine.setState(GameState_InterventionResult.label());
                return;
            }
        }

        for (let i = 0; i < this.selected_interventions.length; i++) {
            this.selected_interventions[i].update();
        }

        for(let i=0;i< this.intervention_cards.length;i++){
            this.intervention_cards[i].update();
        }
    }

    client_draw() {
        this.bg.draw();
        this.heading_text.draw();

        for(let i=0;i< this.intervention_cards.length;i++){
            this.intervention_cards[i].draw();
        }

        let layer = layout_get_by_name(layout,'screen_intervention_select');

        GAZCanvas.clip_start();
        GAZCanvas.clip_rect(GAZCanvas.toScreenSpace(layer_to_rect(layout_get_by_name(layer, 'selected_interventions_clip'))));

        if(this.selected_interventions.length>0) {
            this.selected_intervention_heading_text.draw();

            for (let i = 0; i < this.selected_interventions.length; i++) {
                this.selected_interventions[i].draw();
            }
        }

        GAZCanvas.clip_end();


        for(let i=0;i<4;i++){
            this.intervention_buttons[i].draw();
        }
    }
}

//*********************************************************************************************************************
class GameState_InterventionResult extends GameState_TestModeBase
{
    constructor() {
        super();
    }
    static label()
    {
        return "GameState_InterventionResult";
    }

    init(){
        super.init();
        let layer = layout_get_by_name(layout,'screen_intervention_outcome');

        this.bg = new LayerWidgetRect(layout_get_by_name(layer, 'bg'));
        this.bg.current_color = 'rgb(255,255,255)';

        //heading
        this.heading_text = new LayerWidgetText(layout_get_by_name(layer, 'heading_text'));
        this.heading_text.current_color= 'rgb(0,0,0)';
        this.heading_text.label = 'Intervention Outcome ' + (appInst.model.current_intervention_round+1).toString() +' of 4';

        //interventions
        this.card_front = new InterventionCardWidget(layer_to_rect(layout_get_by_name(layer, 'intervention_1') ));
        this.card_back = new InterventionCardWidget(layer_to_rect(layout_get_by_name(layer, 'intervention_2') ));
        this.card_front.init();
        this.card_front.set_card_info(appInst.model.selected_interventions[appInst.model.current_intervention_round]);

        this.card_back.init();
        this.card_back.set_display('back');
        this.card_back.set_card_info(appInst.model.selected_interventions[appInst.model.current_intervention_round]);

        //outcome heading
        this.outcome_heading = new LayerWidgetText(layout_get_by_name(layer,'outcome_heading_text') );
        this.outcome_heading.label = 'Outcome: ' + appInst.model.intervention_outcomes[appInst.model.current_intervention_round].toString();
        this.outcome_body = new LayerWidgetText(layout_get_by_name(layer,'outcome_body_text') );
        this.outcome_body.label = 'blah blah blah';

        this.next_button = new LayerWidgetButton(layout_get_by_name(layer,'button_next') );

        if (appInst.model.current_intervention_round <3) {
            if (appInst.model.intervention_outcomes[appInst.model.current_intervention_round] == 1){
                this.next_button.set_label('Elect new mayor');
            }else{
                this.next_button.set_label('Next intervention round');
            }

        }else {
            this.next_button.set_label('Go to Event Reckoning');
        }
    }

    client_update(){
        if (this.next_button.update()){
            if (appInst.model.current_intervention_round <3) {
                let next_state = GameState_ChooseIntervention.label();

                if (appInst.model.intervention_outcomes[appInst.model.current_intervention_round] == 1) {
                    next_state = GameState_MayoralElection.label();
                }

                appInst.model.current_intervention_round += 1;
                appInst.stateMachine.setState(next_state);
            }else {
                appInst.model.current_event_round = 0;
                appInst.stateMachine.setState(GameState_EventResult.label());
            }
        }

        this.card_front.update();
    }

    client_draw() {
        this.bg.draw();
        this.heading_text.draw();

        this.card_front.draw();
        this.card_back.draw();

        this.outcome_heading.draw();
        this.outcome_body.draw();

        this.next_button.draw();
    }
}

//*********************************************************************************************************************
class GameState_EventResult extends GameState_TestModeBase
{
    constructor() {
        super();
    }
    static label()
    {
        return "GameState_EventResult";
    }

    init(){
        super.init();
        this.show_card_back = false;
        let layer = layout_get_by_name(layout,'screen_event_outcome');

        this.bg = new LayerWidgetRect(layout_get_by_name(layer, 'bg'));
        this.bg.current_color = 'rgb(255,255,255)';

        //heading
        this.heading_text = new LayerWidgetText(layout_get_by_name(layer, 'heading_text'));
        this.heading_text.current_color= 'rgb(0,0,0)';


        //event
        this.card = new EventCardWidget(layer_to_rect(layout_get_by_name(layer, 'card') ));
        this.card.init();


        //outcome heading
        this.outcome_heading = new LayerWidgetText(layout_get_by_name(layer,'outcome_heading_text') );
        this.outcome_body = new LayerWidgetText(layout_get_by_name(layer,'outcome_body_text') );
        this.outcome_body.label = 'blah blah blah';

        this.next_button = new LayerWidgetButton(layout_get_by_name(layer,'button_next') );

        if (appInst.model.current_event_round <4) {
            this.next_button.set_label('Next intervention round');
        }else {
            this.next_button.set_label('Final Results');
        }

        this.card_flip_button = new LayerWidgetButton(layout_get_by_name(layer,'button_flip_card') );


        this.on_set_event_round();
    }

    on_set_event_round(){
        this.heading_text.label = 'Event Outcome ' + (appInst.model.current_event_round+1).toString() +' of 5';
        this.card.set_card_info(appInst.model.current_event_round);

        this.outcome_heading.label = 'Outcome: ' + appInst.model.intervention_outcomes[appInst.model.current_intervention_round].toString();

        if(this.show_card_back === false){
            this.card_flip_button.set_label('Show Back');
            this.card.set_display('front');
        }else{
            this.card_flip_button.set_label('Show Front');
            this.card.set_display('back');
        }

    }

    client_update(){
        if (this.next_button.update()){
            if (appInst.model.current_event_round <4) {
                appInst.model.current_event_round += 1;
                this.show_card_back = false;
                this.on_set_event_round();
            }else {
                appInst.stateMachine.setState(GameState_FinalOutcome.label());
            }
        }

        if (this.card_flip_button.update()) {
            this.show_card_back = !this.show_card_back;
            this.on_set_event_round();
        }
    }

    client_draw() {
        this.bg.draw();
        this.heading_text.draw();

        this.card.draw();

        this.outcome_heading.draw();
        this.outcome_body.draw();

        this.next_button.draw();
        this.card_flip_button.draw();
    }

}

class GameState_FinalOutcome extends GameState_TestModeBase
{
    constructor() {
        super();
    }
    static label()
    {
        return "GameState_FinalOutcome";
    }


}




