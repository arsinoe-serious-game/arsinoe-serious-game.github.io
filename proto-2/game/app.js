class ARSINOEGame extends AppBase
{
    constructor()
    {
        super();

        this.model = new ModelBase(this);
        this.view = new ViewBase(this);

        this.image = new Image();

        this.buttons = {};
        this.first_intervention = 0;

        this.stateMachine = new StateMachine();
    }

    oneTimeInit()
    {
        this.model.oneTimeInit();
        this.view.oneTimeInit();


        super.oneTimeInit(1600,900);
        this.stateMachine.addState(GameState_Test.label(), new GameState_Test());
        this.stateMachine.addState(GameState_InterventionPreview.label(), new GameState_InterventionPreview());
        this.stateMachine.addState(GameState_SimpleGame.label(), new GameState_SimpleGame());

        this.stateMachine.addState(GameState_InterventionPrint.label(), new GameState_InterventionPrint());
        this.stateMachine.addState(GameState_PersonaPrint.label(), new GameState_PersonaPrint());
        this.stateMachine.addState(GameState_EventPrint.label(), new GameState_EventPrint());

        this.stateMachine.addState(GameState_PlayGame.label(), new GameState_PlayGame());

        this.stateMachine.addState(GameState_Testbed.label(), new GameState_Testbed());

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
        current_mode = GameState_SelectPlayers.label();

        //this.stateMachine.setState(GameState_SimpleGame.label());
        //this.stateMachine.setState(GameState_InterventionPreview.label());
        this.stateMachine.setState(current_mode);

        this.image.src = "assets/interventions/intervention-0.png";
    }

    on_new_game(){
        this.model.on_new_game();
        this.view.on_new_game();
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
        let always_return_bad = false;

        let result = 0;

        if(always_return_bad == true) {
            result = 1;
        }else{
            let always_return_ok = false;

            if (always_return_ok === true) {
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

