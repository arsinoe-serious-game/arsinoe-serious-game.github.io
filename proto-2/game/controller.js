class ControllerBase extends MVCBase{
    constructor(game){
        super(game);
    }

    on_new_game(){
    }

    set_players(player_count){
        this.game.model.players = [];

        for(let i=0;i<player_count;i++){

            while(true) {
                let player_id = this.game.model.random.getInt(0, this.game.model.get_persona_cards().length);

                if (this.game.model.players.indexOf(player_id) == -1) {
                    this.game.model.players.push(player_id);
                    break;
                }
            }
        }
    }

    select_mayor(){

        this.game.model.current_mayor = 0;

        if (this.game.model.players.length > 1) {
            let player_choice = [];

            for (let i = 0; i < this.game.model.players.length; i++) {
                if (i != this.game.model.current_mayor) {
                    player_choice.push(i);
                }
            }

            this.game.model.current_mayor = this.game.model.random.getChoice(player_choice);
        }
    }

    select_intervention(entry) {
        this.game.model.selected_interventions.push(entry);

        const index = this.game.model.current_deck.indexOf(entry);
        if (index > -1) {
            this.game.model.current_deck.splice(index, 1);
        }

        //this.game.model.intervention_outcomes.push(appInst.model.random.getChoice([1,2,3,4,5,6]));
        this.game.model.intervention_outcomes.push(1);
    }

    get_round_cards() {
        let current_options = [];

        for (let i = 0; i < 4; i++) {
            while (true){
                let intervention = this.game.model.random.getChoice(this.game.model.current_deck);

                if ((current_options.indexOf(intervention) == -1) &&  !(this.game.model.invention_type_in_cards(intervention, current_options))) {
                    current_options.push(intervention);
                    break;
                }
            }
        }
        return current_options;
    }

    setup_for_interventions(){
        this.game.model.current_intervention_round = 0;
    }
}