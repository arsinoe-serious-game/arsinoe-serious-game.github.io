function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function getCookieAsList(cname){
    let r = getCookie(cname).split(',');

    let result = [];

    for (let i=0;i< r.length;i++){
        result.push(r[i]);
    }

    return result;
}

function getCookieAsIntList(cname){
    let r = getCookie(cname).split(',');

    let result = [];

    for (let i=0;i< r.length;i++){
        if (r[i].length > 0) {
            result.push(parseInt(r[i]));
        }
    }

    return result;
}

/*
    EP - Economic protection
    BP - Bio (diversity) protection
    FP - Flood protection
    DP - Drought protection
    HP - Heat protection
 */

class ModelBase extends MVCBase{
    constructor(game){
        super(game);
        this.current_deck = [];
        this.selected_interventions = [];
        this.current_intervention_round = 0;
        this.intervention_outcomes = [];

        this.random = new Random(123456);
        this.random = new Random(new Date().getTime() / 1000);

        this.players = [];
        this.current_mayor = '';

        this.current_event_round = 0;

        this.events = {};
        this.events['EP'] = {'name': 'Economic'};
        this.events['BP'] = {'name': 'Biodiversity'};
        this.events['FP'] = {'name': 'Flood'};
        this.events['DP'] = {'name': 'Drought'};
        this.events['HP'] = {'name': 'Heat Wave'};

        this.event_order = ['EP', 'BP', 'FP', 'DP', 'HP'];

        this.event_severity = ['minor', 'average', 'extreme'];
        this.event_prepareness = ['Severely under-prepared',
                'Under-prepared',
                'Fitting',
                'Overkill',
                //'over-prepared',
        ];

        this.event_outcomes = {};
    }

    on_new_game() {
        super.on_new_game();

        this.current_deck = [];
        this.intervention_outcomes=[];

        let index = 0;
        for(let i=0;i< this.get_intervention_cards().length;i++)
            this.current_deck.push(i);

        this.round = 0;
        this.selected_interventions = [];

        this.players = [];
        this.current_mayor = '';
    }

    get_intervention_cards(){
        return game_data['interventions'];
    }

    get_persona_cards(){
        return game_data['persona'];
    }

    get_event_cards(){
        return game_data['resilience'];
    }


    get_game_text(ID){
        for(let i=0;i< game_data['text'].length;i++ ){
            if (game_data['text'][i]['ID'] === ID){
                return game_data['text'][i]['text'];
            }
        }

        return '***NOT IN DB';
    }

    do_cookie_data(b_get){

        if (b_get){
            let current_deck = getCookieAsIntList('current_deck');
            let selected_interventions =getCookieAsIntList('selected_interventions');
            let players = getCookieAsList('players');
            let current_mayor = getCookie('current_mayor');
            console.log(current_deck);
        }else{
            setCookie('current_deck', this.current_deck, 365);
            setCookie('selected_interventions', this.selected_interventions, 365);
            setCookie('players', this.players, 365);
            setCookie('current_mayor', this.current_mayor, 365);
        }
    }

    get_cookie_data(){
        return this.do_cookie_data(true);
    }

    set_cookie_data(){
        return this.do_cookie_data(false);
    }

    get_intervention_card(entry){
        return this.get_intervention_cards()[entry];
    }

    card_to_string(card){
        let text = '';
        try {
            text += (card['type'] + ' ' + card['name']).padEnd(40, ' ');
            text += '  EP:' + card['EP'].toString().padEnd(2, ' ');
            text += '  BP:' + card['BP'].toString().padEnd(2, ' ');
            text += '  FP:' + card['FP'].toString().padEnd(2, ' ');
            text += '  DP:' + card['DP'].toString().padEnd(2, ' ');
            text += '  HP:' + card['HP'].toString().padEnd(2, ' ');
        }catch (e){
            console.log('error');
        }

        return text;
    }

    invention_type_in_cards(intervention, current_options) {
        for (let i = 0; i < current_options.length; i++) {
            let card = current_options[i];
            if (this.get_intervention_cards()[intervention]['type'] == this.get_intervention_card(card)['type']) {
                return true;
            }
        }
        return false;
    }

    //*********************************************************************************************************************

    get_event_random_severity() {
        return this.random.getChoice(this.event_severity);
    }

    get_protection() {
        let protection = {};

        protection['EP'] = 0;
        protection['BP'] = 0;
        protection['FP'] = 0;
        protection['DP'] = 0;
        protection['HP'] = 0;

        for(let i=0;i< this.selected_interventions.length;i++) {
            let card = this.get_intervention_card(this.selected_interventions[i]);

            for (const [key, value] of Object.entries(protection)) {
                protection[key] += parseInt(card[key]);
            }
        }

        return protection;
    }

    get_response(severity, score) {
        if (severity == 'minor') {
            if (score < 1) {
                return this.event_prepareness[1];
            }

            if (score < 3) {
                return this.event_prepareness[2];
            }
/*
            if (score > 6) {
                return 'extreme overkill';
            }
*/
            return this.event_prepareness[3];
        }

        if (severity == 'average') {
            if (score < 1) {
                return this.event_prepareness[0];
            }

            if (score < 3) {
                return this.event_prepareness[1];
            }

            if (score < 5) {
                return this.event_prepareness[2];
            }

            return this.event_prepareness[3];
        }

        if (severity == 'extreme') {
            if (score < 3) {
                return this.event_prepareness[0];
            }

            if (score < 5) {
                return this.event_prepareness[1];
            }

            return this.event_prepareness[3];
        }

        return 'n/a';
    }
}