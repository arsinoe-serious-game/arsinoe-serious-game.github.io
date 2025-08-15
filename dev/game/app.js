function resize_window(width, height) {
    if (window.outerWidth) {
        window.resizeTo(
            width + (window.outerWidth - window.innerWidth),
            height + (window.outerHeight - window.innerHeight)
        );
    } else {
        window.resizeTo(500, 500);
        window.resizeTo(
            width + (500 - document.body.offsetWidth),
            height + (500 - document.body.offsetHeight)
        );
    }
}

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

        let prot = this.model.get_protection();

        let text = current_event +' ';
        text +=  'Severity:'+ this.model.event_outcomes[current_event]['severity'];
        text += ' <br> ';
        text += ' <br> ';
        text += 'Preparedness: '+ this.model.event_outcomes[current_event]['outcome'] + ' (Protection: ' +prot[current_event].toString()+')';

        return text;
    }

    get_event_outcome_body_text(current_event){
        //which card is event?
        let card = undefined;
        let card_set = this.model.get_event_cards();

        let text = '';
        text += ' <br> ';

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
    
    print_all_cards(){

        /*
            do all the fronts, left to right
            then all the back, right to left

            front| back
            1 2  | 2 1
            3 4  | 4 3

         */
        let tick_count = 0;
        let current_card = 0;

        let max_cards = appInst.model.get_intervention_cards().length;

        let card_type = '';
        
        let card_list = [
         //   'inteventions',
        //'events',
        //'personas',
        //'single_intevention',
        'single_event_side'
        ];

        let isDone = false;


        let widget_list = {};

        let template   = undefined;
        let current_side = 'front';
        let lookup = [0,1,2,3];

        let has_current_cardset = false;
        let current_cardset_index = 0;

        let cards_per_page = 4;
        

        setInterval(function () {
            if(!isDone) {
                if (!has_current_cardset) {

                    has_current_cardset = true;
                    card_type = card_list[current_cardset_index];
                    current_cardset_index += 1;


                    if (card_type === 'inteventions') {
                        template = layout_get_by_name(layout, 'print_6x4x4');
                        cards_per_page = 4;
                    }

                    if (card_type === 'events') {
                        template = layout_get_by_name(layout, 'print_events');
                        cards_per_page = 2;
                    }

                    if (card_type === 'personas') {
                        //template = layout_get_by_name(layout, 'print_personas');
                        template = layout_get_by_name(layout, 'print_6x4x4');
                        cards_per_page = 4;
                    }

                    if (card_type === 'single_intevention') {
                        template = layout_get_by_name(layout, 'print_single_card');
                        cards_per_page = 1;
                    }

                    if (card_type === 'single_event_side') {
                        template = layout_get_by_name(layout, 'print_event_side');
                        cards_per_page = 1;
                    }

                    widget_list = {};
                    widget_list['bg'] = new LayerWidgetRect(layout_get_by_name(template, 'bg'));
                    widget_list['bg'].current_color = 'rgb(255,255,255)';
                    widget_list['bg'].draw_outline = false;

                    let bg_bleed = layout_get_by_name(template, 'bleed_bg');

                    if (bg_bleed !== null) {
                        widget_list['bg2'] = new LayerWidgetRect(bg_bleed);
                        widget_list['bg2'].current_color = 'rgb(255,0,0)';
                        widget_list['bg2'].draw_outline = false;
                    }

                    if (card_type === 'inteventions') {
                        max_cards = appInst.model.get_intervention_cards().length;
                        widget_list['card_0'] = new InterventionCardWidget(layer_to_rect(layout_get_by_name(template, 'card_top_left')));
                        widget_list['card_1'] = new InterventionCardWidget(layer_to_rect(layout_get_by_name(template, 'card_top_right')));

                        widget_list['card_2'] = new InterventionCardWidget(layer_to_rect(layout_get_by_name(template, 'card_bottom_left')));
                        widget_list['card_3'] = new InterventionCardWidget(layer_to_rect(layout_get_by_name(template, 'card_bottom_right')));
                    }

                    if (card_type === 'events') {
                        max_cards = appInst.model.get_event_cards().length;
                        widget_list['card_0'] = new EventCardWidget(layout_get_by_name(template, 'card_front')); //top
                        widget_list['card_1'] = new EventCardWidget(layout_get_by_name(template, 'card_back')); //bottom
                    }

                    if (card_type === 'personas') {
                        max_cards = appInst.model.get_persona_cards().length;
                        widget_list['card_0'] = new PersonaCardWidget(layer_to_rect(layout_get_by_name(template, 'card_top_left')));
                        widget_list['card_1'] = new PersonaCardWidget(layer_to_rect(layout_get_by_name(template, 'card_top_right')));

                        widget_list['card_2'] = new PersonaCardWidget(layer_to_rect(layout_get_by_name(template, 'card_bottom_left')));
                        widget_list['card_3'] = new PersonaCardWidget(layer_to_rect(layout_get_by_name(template, 'card_bottom_right')));
                    }

                    if (card_type === 'single_intevention') {
                        max_cards = appInst.model.get_intervention_cards().length;
                        widget_list['card_0'] = new InterventionCardWidget(layer_to_rect(layout_get_by_name(template, 'card_front')));
                    }

                    if (card_type === 'single_event_side') {
                        max_cards = appInst.model.get_event_cards().length;
                        widget_list['card_0'] = new EventCardWidget(layout_get_by_name(template, 'card_front'));
                    }

                    widget_list['card_0'].init();

                    if ('card_1' in widget_list) {
                        widget_list['card_1'].init();
                        widget_list['card_1'].set_display('back');
                        widget_list['card_1'].set_card_info(current_card);
                    }

                    widget_list['card_0'].set_card_info(current_card);

                    current_side = 'front';
                    current_card = 0;
                }

                //set-up mode
                lookup = [0, 1, 2, 3];

                if (current_side === 'back') {
                    lookup = [1, 0, 3, 2];
                }

                if (cards_per_page == 2) {
                    lookup = [0, 1];
                }

                if (cards_per_page == 1) {
                    lookup = [0];
                }

                for (let i = 0; i < cards_per_page; i++) {
                    let card_id = 'card_' + i.toString();

                    if (card_id in widget_list) {
                        widget_list[card_id].init();
                        widget_list[card_id].visible = (((current_card * cards_per_page) + lookup[i]) < max_cards);

                        if (widget_list[card_id].visible) {
                            widget_list[card_id].set_display(current_side);
                            widget_list[card_id].set_card_info((current_card * cards_per_page) + lookup[i]);

                            if ('bg2' in widget_list) {
                                widget_list['bg2'].current_color = widget_list[card_id].get_bg_col();
                                widget_list['bg2'].draw_outline = false;
                            }
                        }
                    }
                }

                GAZCanvas.referenceScreenSize.w = widget_list['bg'].w;
                GAZCanvas.referenceScreenSize.h = widget_list['bg'].h;

                console.log('R:' + GAZCanvas.referenceScreenSize.w.toString() + 'x' + GAZCanvas.referenceScreenSize.h.toString());

                resize_window(GAZCanvas.referenceScreenSize.w, GAZCanvas.referenceScreenSize.h);
                console.log('W:' + window.innerWidth.toString() + 'x' + window.innerHeight.toString());

                GAZCanvas.update();
                GAZCanvas.Rect(new Rect(0, 0, GAZCanvas.referenceScreenSize.w, GAZCanvas.referenceScreenSize.h), 'rgb(255,255,255)');

                if (widget_list !== undefined) {
                    for (const [key, value] of Object.entries(widget_list)) {
                        value.draw();
                    }
                }

                if (tick_count > 10) {
                    console.log();
                    Canvas.save(card_type + '_' + current_card.toString() + '_' + current_side + '.png');
                    tick_count = 0;

                    if (current_card < Math.floor((max_cards) / cards_per_page)) {
                        current_card += 1;
                    } else {
                        if (current_side === 'front') {
                            current_side = 'back';
                            current_card = 0;

                            if (card_type === 'personas') {
                                isDone = true;
                            }

                        } else {
                            isDone = true;
                        }
                    }

                    if (isDone === true) {
                        if (current_cardset_index < card_list.length) {
                            // do the next cards
                            isDone = false;
                            has_current_cardset = false;
                            current_card = 0;
                        } else {

                        }
                    }
                }
                tick_count += 1;
            }
        }, 17);
    }

    Run(args) {
        //do oneTimeInit once

        appInst.oneTimeInit();

        if ((args !== undefined) && (args))
        {
            this.print_all_cards();
        }


        setInterval(function () {
            //on each frame ...
            GAZCanvas.update();

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

