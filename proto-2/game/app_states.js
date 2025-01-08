//*********************************************************************************************************************
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
                appInst.set_players(i+1);
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
        this.heading_text.label = 'Players';

        //1-7 players
        this.player_button = [];

        for(let i=0;i < appInst.model.players.length;i++){
            let l = layout_get_by_name(layer, 'player_'+(i+1).toString());
            let b = new PersonaCardWidget(layer_to_rect(layout_get_by_name(l, 'card')));
            b.init();
            b.visible = true;
            b.set_card_info(appInst.model.players[i]);

            let t = new LayerWidgetText(layout_get_by_name(l, 'text'));
            t.visible = true;
            t.label = 'Player: ' + (i+1).toString();


            this.player_button.push({'card':b, 'text':t});

        }

        this.continue_button = new LayerWidgetButton(layout_get_by_name(layer,'button_ok'));
        this.continue_button.set_label('Continue');

    }

    client_update(){

        if (this.continue_button.update()){
            //set-up for interventions
            appInst.setup_for_interventions();
            appInst.stateMachine.setState(GameState_MayoralElection.label());
        }
    }

    client_draw() {
        this.bg.draw();
        this.heading_text.draw();

        for(let i = 0;i<this.player_button.length;i++){
            this.player_button[i]['card'].draw();
            this.player_button[i]['text'].draw();
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

        appInst.select_mayor();

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
        this.player_text.label = 'Player:' + (appInst.model.current_mayor+1).toString();


        //player_card
        this.player_card = new PersonaCardWidget(layer_to_rect(layout_get_by_name(layer, 'mayor_persona')));
        this.player_card.init();
        this.player_card.set_card_info(appInst.model.players[appInst.model.current_mayor]);

        //mayor text
        this.mayor_text = new LayerWidgetText(layout_get_by_name(layer, 'mayor_text'));
        this.mayor_text.current_color= 'rgb(0,0,0)';
        this.mayor_text.font_style = '';
        this.mayor_text.font_just = 'left';
        this.mayor_text.label = appInst.model.get_game_text('MAYOR_DETAIL');

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

        //this.debug_layers.draw();

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

        this.round_cards = appInst.get_round_cards();

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

        this.resilience_table = new LayerWidgetResillienceTable(layout_get_by_name(layer, 'protection_table'));
        this.resilience_table.init();
    }

    client_update(){
        for(let i=0;i<4;i++){
            if(this.intervention_buttons[i].update() === true){
                //select intervention
                appInst.select_intervention(this.round_cards[i]);
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

        if(this.selected_interventions.length>0) {
            GAZCanvas.clip_start();
            GAZCanvas.clip_rect(GAZCanvas.toScreenSpace(layer_to_rect(layout_get_by_name(layer, 'selected_interventions_clip'))));


            this.selected_intervention_heading_text.draw();

            for (let i = 0; i < this.selected_interventions.length; i++) {
                this.selected_interventions[i].draw();
            }

            GAZCanvas.clip_end();

            this.resilience_table.set_resilience(appInst.model.get_protection());

            this.resilience_table.draw();
        }

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
        this.outcome_heading.label = 'Outcome: ' + appInst.get_intervention_outcome_label(appInst.model.current_intervention_round);
        this.outcome_body = new LayerWidgetText(layout_get_by_name(layer,'outcome_body_text') );
        this.outcome_body.current_color= 'rgb(0,0,0)';
        this.outcome_body.font_style = '';
        this.outcome_body.font_just = 'left';

        let c = appInst.model.get_intervention_cards()[appInst.model.selected_interventions[appInst.model.current_intervention_round]];

        this.outcome_body.label = c['outcome-'+appInst.model.intervention_outcomes[appInst.model.current_intervention_round].toString()];

        if (appInst.is_current_intervention_new_mayor() ) {
            this.outcome_body.label += ' <br> <br> <b> The citizens demand a new mayor! </b>';
        }

        this.next_button = new LayerWidgetButton(layout_get_by_name(layer,'button_next') );

        if (appInst.model.current_intervention_round <3) {
            if (appInst.is_current_intervention_new_mayor() ){
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

                if (appInst.is_current_intervention_new_mayor() ){
                    next_state = GameState_MayoralElection.label();
                }

                appInst.model.current_intervention_round += 1;
                appInst.stateMachine.setState(next_state);
            }else {
                appInst.on_setup_event_results();
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
        this.debug_layers = new LayerWidgetBase(layer);

        this.bg = new LayerWidgetRect(layout_get_by_name(layer, 'bg'));
        this.bg.current_color = 'rgb(255,255,255)';

        //heading
        this.heading_text = new LayerWidgetText(layout_get_by_name(layer, 'heading_text'));
        this.heading_text.current_color= 'rgb(0,0,0)';


        //event
        this.card = new EventCardWidget(layout_get_by_name(layer, 'card') );
        this.card.init();


        //outcome heading
        this.outcome_heading = new LayerWidgetText(layout_get_by_name(layer,'outcome_heading_text') );
        this.outcome_body = new LayerWidgetText(layout_get_by_name(layer,'outcome_body_text') );
        this.outcome_body.label = 'blah blah blah';
        this.outcome_body.font_just = 'left';

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

        let current_event = appInst.model.event_order[appInst.model.current_event_round];

        this.outcome_heading.label = appInst.get_event_outcome_heading_text(current_event);
        this.outcome_body.label = appInst.get_event_outcome_body_text(current_event);



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

        if(this.show_card_back === false){
            this.card.update();
        }
    }

    client_draw() {
        this.bg.draw();
        //this.debug_layers.draw();
        this.heading_text.draw();

        this.card.draw();

        this.outcome_heading.draw();
        this.outcome_body.draw();

        this.next_button.draw();
        this.card_flip_button.draw();
    }
}
//*********************************************************************************************************************
class GameState_FinalOutcome extends GameState_TestModeBase
{
    constructor() {
        super();
    }
    static label()
    {
        return "GameState_FinalOutcome";
    }

    init(){
        super.init();
        this.show_card_back = false;
        let layer = layout_get_by_name(layout,'screen_final_results');

        this.bg = new LayerWidgetRect(layout_get_by_name(layer, 'bg'));
        this.bg.current_color = 'rgb(255,255,255)';

        //heading
        this.heading_text = new LayerWidgetText(layout_get_by_name(layer, 'heading_text'));
        this.heading_text.label = 'Final Results';
        this.heading_text.current_color= 'rgb(0,0,0)';



        //outcome heading
        this.outcome_body = new LayerWidgetText(layout_get_by_name(layer,'outcome_body_text') );
        this.outcome_body.label = 'blah blah blah';

        this.next_button = new LayerWidgetButton(layout_get_by_name(layer,'button_next') );

        this.next_button.set_label('End Game');
    }

    client_update(){
        if (this.next_button.update()){
            appInst.stateMachine.setState(GameState_SelectPlayers.label());
        }
    }

    client_draw() {
        this.bg.draw();
        this.heading_text.draw();
        this.outcome_body.draw();
        this.next_button.draw();
    }

}
//*********************************************************************************************************************
