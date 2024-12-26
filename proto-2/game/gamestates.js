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
                        console.log('Round:' + round.toString()+ ' of 4. deck size:' +appInst.model.current_deck.length.toString() );

                        if (appInst.model.selected_interventions.length > 0) {
                            let text = 'Selected Interventions';
                            text +='\n';

                            for(let i=0;i< appInst.model.selected_interventions.length;i++) {
                                let card = appInst.model.selected_interventions[i];
                                text += '\t'+ appInst.model.card_to_string(appInst.model.get_intervention_card(card));
                                text +='\n';
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

                            text += (i + 1).toString() + '. ';

                            if (false) {
                                text += str(entry) + ' ';
                            }

                            let card = appInst.model.get_intervention_card(entry);
                            text += appInst.model.card_to_string(card);

                            text +='\n';
                        }

                        console.log(text);

                        let selected_intervention = current_options[Math.floor(Math.random()*current_options.length)];

                        console.log('You selected: ' + appInst.model.get_intervention_card(selected_intervention)['name']);

                        appInst.model.select_intervention(selected_intervention);
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