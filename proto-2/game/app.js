class ARSINOEGame extends AppBase
{
    constructor()
    {
        super();

        this.model = new ModelBase(this);
        this.view = new ViewBase(this);

        this.buttons = {};
        this.first_intervention = 0;

        this.stateMachine = new StateMachine();

        //cheat values
        this.always_return_bad = false;
        this.always_return_ok = false;

    }

    oneTimeInit()
    {
        this.model.oneTimeInit();
        this.view.oneTimeInit();

        super.oneTimeInit(1600,900);
        this.stateMachine.addState(GameState_Test.label(), new GameState_Test());
        this.stateMachine.addState(GameState_SimpleGame.label(), new GameState_SimpleGame());

        //preview cards
        this.stateMachine.addState(GameState_InterventionPreview.label(), new GameState_InterventionPreview());
        this.stateMachine.addState(GameState_AllInterventionPreview.label(), new GameState_AllInterventionPreview());

        //print cards
        this.stateMachine.addState(GameState_InterventionPrint.label(), new GameState_InterventionPrint());
        this.stateMachine.addState(GameState_PersonaPrint.label(), new GameState_PersonaPrint());
        this.stateMachine.addState(GameState_EventPrint.label(), new GameState_EventPrint());

        this.stateMachine.addState(GameState_PlayGame.label(), new GameState_PlayGame());

        this.stateMachine.addState(GameState_Testbed.label(), new GameState_Testbed());

        //actual game
        this.stateMachine.addState(GameState_SelectPlayers.label(), new GameState_SelectPlayers());
        this.stateMachine.addState(GameState_ViewPlayers.label(), new GameState_ViewPlayers());
        this.stateMachine.addState(GameState_MayoralElection.label(), new GameState_MayoralElection());
        this.stateMachine.addState(GameState_ChooseIntervention.label(), new GameState_ChooseIntervention());
        this.stateMachine.addState(GameState_InterventionResult.label(), new GameState_InterventionResult());
        this.stateMachine.addState(GameState_EventResult.label(), new GameState_EventResult());
        this.stateMachine.addState(GameState_FinalOutcome.label(), new GameState_FinalOutcome());


        let current_mode = GameState_EventPrint.label();

        current_mode = GameState_InterventionPrint.label();
        current_mode = GameState_PersonaPrint.label();
        current_mode = GameState_Testbed.label();

        //current_mode = GameState_InterventionPreview.label();
        //current_mode = GameState_SimpleGame.label();

        //this.stateMachine.setState(GameState_SimpleGame.label());
        //this.stateMachine.setState(GameState_InterventionPreview.label());
        this.stateMachine.setState(current_mode);
    }

    on_new_game(){
        this.model.on_new_game();
        this.view.on_new_game();
    }

    on_draw_start(){
        this.view.on_draw_start();
    }

    set_players(player_count){
        this.model.players = [];

        for(let i=0;i<player_count;i++){

            while(true) {
                let player_id = this.model.random.getInt(0, this.model.get_persona_cards().length);

                if (this.model.players.indexOf(player_id) == -1) {
                    this.model.players.push(player_id);
                    break;
                }
            }
        }
    }

    select_mayor(){

        this.model.current_mayor = 0;

        if (this.model.players.length > 1) {
            let player_choice = [];

            for (let i = 0; i < this.model.players.length; i++) {
                if (i != this.model.current_mayor) {
                    player_choice.push(i);
                }
            }

            this.model.current_mayor = this.model.random.getChoice(player_choice);
        }
    }

    get_intervention_outcome_label(round){

        let dice = ['1: Oh Dear!','2-3: Not Good','4-5:Not Bad','6:Great'];

        if (round < this.model.intervention_outcomes.length){
            return dice[this.model.intervention_outcomes[round]];
        }

        return 'ERROR';
    }

    is_current_intervention_new_mayor(){
        return this.model.intervention_outcomes[appInst.model.current_intervention_round] == 0;
    }

    select_intervention(entry) {
        this.model.selected_interventions.push(entry);

        const index = this.model.current_deck.indexOf(entry);
        if (index > -1) {
            this.model.current_deck.splice(index, 1);
        }
        /*
            dice to outcomes
            1 - 0
            2 - 1
            3 - 1
            4 - 2
            5 - 2
            6 - 3
         */

        let dice_to_outcome_lookup = [0,1,1,2,2,3];

        //let always_return_bad = true;
        this.always_return_bad = false;

        let result = 0;

        if(this.always_return_bad == true) {
            result = 1;
        }else{
            if (this.always_return_ok === true) {
                result = this.model.random.getChoice([2, 3, 4, 5, 6]);
            }else{
                result = this.model.random.getChoice([1, 2, 3, 4, 5, 6]);
            }
        }
        this.model.intervention_outcomes.push(dice_to_outcome_lookup[result-1]);
    }

    get_round_cards() {
        let current_options = [];

        for (let i = 0; i < 4; i++) {
            while (true){
                let intervention = this.model.random.getChoice(this.model.current_deck);

                if ((current_options.indexOf(intervention) == -1) &&  !(this.model.invention_type_in_cards(intervention, current_options))) {
                    current_options.push(intervention);
                    break;
                }
            }
        }
        return current_options;
    }

    setup_for_interventions(){
        this.model.current_intervention_round = 0;
    }


    on_setup_event_results(){
        this.model.current_event_round = 0;

        this.model.event_outcomes = {};

        let prot = this.model.get_protection();

        for (const [key, value] of Object.entries(this.model.events)) {
            this.model.event_outcomes[key] = {};
            this.model.event_outcomes[key]['severity'] = this.model.get_event_random_severity();
            this.model.event_outcomes[key]['outcome'] = this.model.get_response(this.model.event_outcomes[key]['severity'], prot[key]);
        }
    }

    get_event_outcome_heading_text(current_event){
        let text = current_event +' ';
        text +=  'Severity:'+ this.model.event_outcomes[current_event]['severity'];
        text += ' <br> ';
        text += ' <br> ';
        text += 'Preparedness: '+ this.model.event_outcomes[current_event]['outcome'];

        return text;
    }

    get_event_outcome_body_text(current_event){
        //which card is event?
        let card = undefined;
        let card_set = this.model.get_event_cards();

        let text = '';

        for(let i=0;i< card_set.length;i++){
            if (card_set[i]['type'] === current_event){
                text += ' <b> Severity </b> ';
                text += ' <br> ';

                for(let s=0;s<this.model.event_severity.length;s++) {

                    if (this.model.event_outcomes[current_event]['severity'] === this.model.event_severity[s]) {
                        text += card_set[i]['desc-' + (s + 1).toString()];
                    }
                }

                text += ' <br> ';
                text += ' <br> ';

                text += ' <b> Outcome </b> ';
                text += ' <br> ';

                for(let s=0;s<this.model.event_prepareness.length;s++) {
                    if (this.model.event_outcomes[current_event]['outcome'] === this.model.event_prepareness[s]) {
                        text += card_set[i]['outcome-' + s.toString()];
                    }
                }

                text += ' <br> ';
            }
        }

        return text;

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

    draw()
    {
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
            appInst.on_draw_start();
            appInst.stateMachine.draw();

            //draw the letterbox over the screen to hide any overdraw
            GAZCanvas.drawLetterbox(appInst.letterboxColour);
        }, 17);
    }

}

appInst = new ARSINOEGame();

