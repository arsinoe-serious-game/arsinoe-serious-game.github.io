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

        this.buttons = {};
        this.first_intervention = 0;
    }

    on_interventon_button(b, step){

        this.first_intervention += step;

        this.buttons['prev_intervention'].active = this.first_intervention > 0;
        this.buttons['next_intervention'].active = (this.first_intervention+step < intervention_cards.length);
    }

    init()
    {
        super.init();

        let self = this;

        this.buttons['prev_intervention'] = new ButtonBase(new Rect(10,200, 50,100));
        this.buttons['prev_intervention'].active = false;
        this.buttons['prev_intervention'].label = 'PREV';
        this.buttons['prev_intervention'].on_click = function (d) {
                self.on_interventon_button(d, -4);
            };


        this.buttons['next_intervention'] = new ButtonBase(new Rect(1200,200, 50,100));
        this.buttons['next_intervention'].active = true;
        this.buttons['next_intervention'].label = 'NEXT';
        this.buttons['next_intervention'].on_click = function (d) {
                self.on_interventon_button(d, 4);
            };
    }

    update()
    {
        super.update();

        for (const [key, value] of Object.entries(this.buttons)) {
                this.buttons[key].update();
        }
    }

    draw()
    {
        appInst.draw();
        super.draw();

        GAZCanvas.clip_start();
        //GAZCanvas.clip_rect(GAZCanvas.toScreenSpace(new Rect(10, 20, 800, 900)));

        for(let i=0;i<4;i++) {
            appInst.draw_card(new Vector2(80 + (i * (270 + 10)), 70), i+this.first_intervention);
        }

        GAZCanvas.clip_end();

        for(let i=0;i<5;i++) {
            appInst.draw_card(new Vector2(80 + (i * (270 + 10)), 70 +410), i+4);
        }

        for (const [key, value] of Object.entries(this.buttons)) {
            this.buttons[key].draw();
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
                        console.log('Round:' + round.toString());

                        print('Round ' + str(round + 1) + ' of ' + str(4) + ' deck size:' + str(len(self.current_deck)))
                        if (appInst.model.selected_interventions.length > 0) {
                            print('Interventions selected');
                            self.print_selected_interventions();
                        }



                        let current_options = appInst.model.get_round_cards();

                        for (let i=0;i< current_options.length;i++) {

                            let entry = current_options[i];

                            let text = '';

                            text += (i+1).toString() + '. ';

                            if (false) {
                                text += str(entry) + ' ';
                            }

                            let card = appInst.model.get_intervention_card(entry);

                            text += (card['type'] + ' ' + card['name']).padEnd(40, ' ');
                            text += '  EP:' + card['EP'].toString().padEnd(2, ' ');
                            text += '  BP:' + card['BP'].toString().padEnd(2, ' ');
                            text += '  FP:' + card['FP'].toString().padEnd(2, ' ');
                            text += '  DP:' + card['DP'].toString().padEnd(2, ' ');
                            text += '  HP:' + card['HP'].toString().padEnd(2, ' ');

                            console.log(text);


                            let selected_intervention = current_options[Math.floor(Math.random()*current_options.length)];

                            console.log('You selected: ' + selected_intervention['name']);

                            appInst.model.select_intervention(selected_intervention);
                        }

                    }
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