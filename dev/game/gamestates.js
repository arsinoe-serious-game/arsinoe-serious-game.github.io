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

        let button_width = 500;
        let button_height = 75;

        let menu_choices = [
            {'label':'View Persona cards for printing', 'mode':GameState_PersonaPrint.label()},
            {'label':'View Intervention cards for printing', 'mode':GameState_InterventionPrint.label()},
            {'label':'View Event cards for printing', 'mode':GameState_EventPrint.label()},
            {'label':'View intervention cards by type', 'mode':GameState_InterventionPreview.label()},
            {'label':'View all intervention cards', 'mode':GameState_AllInterventionPreview.label()},
            {'label':'View all rules cards', 'mode':GameState_AllRulesPreview.label()},

            {'label':'Play Game', 'mode':GameState_SelectPlayers.label()},
            {'label':'Print Cards', 'mode':undefined}
        ];



        for (let i=0;i<menu_choices.length;i++) {

            let button_label = 'button_'+i.toString();

            this.widget_list[button_label] = new ButtonBase(new Rect((1600 - button_width) / 2, 100 + ((button_height + 25) * i), button_width, button_height));
            this.widget_list[button_label].set_active(true);
            this.widget_list[button_label].set_label( menu_choices[i]['label']);
            this.widget_list[button_label].label.font_size = 24;
            this.widget_list[button_label].label.font_family = appInst.view.get_font_family();
            this.widget_list[button_label].on_click = function (d) {

                if(menu_choices[i]['mode'] !== undefined) {
                    appInst.stateMachine.setState(menu_choices[i]['mode']);
                }else{
                    window.open('printing.html', '','location=yes,height=570,width=520,scrollbars=yes,status=yes');
                }

            };
        }
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

        GAZCanvas.Text(20,GAZCanvas.currentScreenSize.toString(),new Vector2(0,20),'rgb(255,255,255)', 'left', appInst.view.get_font_family());

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



                        let current_options = appInst.get_round_cards();

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

                        appInst.select_intervention(selected_intervention);

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
                        let outcome_response = appInst.model.get_intervention_card(selected_intervention)['outcome-0'];

                        let have_an_election = false;

                        if (outcome == 1){
                            outcome_response = 'BAD:'+outcome_response +'\n' + 'The citizens demand a new mayor!';
                            have_an_election = true;
                        }

                        if (outcome >1 && outcome< 4 ){
                            outcome_response = 'OK:'+appInst.model.get_intervention_card(selected_intervention)['outcome-1'];
                        }

                        if (outcome >3 && outcome< 6 ){
                            outcome_response = 'GOOD:'+appInst.model.get_intervention_card(selected_intervention)['outcome-2'];
                        }

                        if (outcome == 6){
                            outcome_response = 'GREAT:'+appInst.model.get_intervention_card(selected_intervention)['outcome-3'];
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

                            appInst.select_mayor();
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

        this.print_screen = false;

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
        //appInst.draw();
        super.draw();
        GAZCanvas.Rect(new Rect(0, 0, GAZCanvas.referenceScreenSize.w, GAZCanvas.referenceScreenSize.h), 'rgb(255,255,255)');

        GAZCanvas.clip_start();
        //GAZCanvas.clip_rect(GAZCanvas.toScreenSpace(new Rect(10, 20, 800, 900)));

        GAZCanvas.clip_end();

        this.client_draw();

        this.quit_button.draw();

        if(this.mode === 'modal'){
            this.quit_modal.draw();
        }

        if (this.print_screen === true){
            Canvas.save('');
            this.print_screen = false;
        }

        //appInst.draw_mouse_pointer();
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
        appInst.set_players(5);
        appInst.select_mayor();

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
