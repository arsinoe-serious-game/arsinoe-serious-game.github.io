class ARSINOEGame extends AppBase
{
    /*
        EP - Economic protection
        BP - Bio (diversity) protection
        FP - Flood protection
        DP - Drought protection
        HP - Heat protection
     */
    constructor()
    {
        super();

        this.image = new Image();

        this.buttons = {};
        this.first_intervention = 0;
    }

    prev_interventon(b){
        console.log('prev');

        this.first_intervention -= 1;

        if (this.first_intervention == 0){
            this.buttons['prev_intervention'].active = false;
        }

        if (this.first_intervention < interventions.length){
            this.buttons['next_intervention'].active = true;
        }
    }

    next_interventon(b){
        console.log('next');

        this.first_intervention += 1;

        if (this.first_intervention > 0){
            this.buttons['prev_intervention'].active = true;
        }

        if (this.first_intervention >= interventions.length){
            this.buttons['next_intervention'].active = false;
        }
    }
    
    oneTimeInit()
    {
        let self = this;

        super.oneTimeInit(1600,900);

        this.image.src = "assets/interventions/intervention-0.png";

        this.buttons['prev_intervention'] = new ButtonBase(new Rect(10,200, 50,100));
        this.buttons['prev_intervention'].active = false;
        this.buttons['prev_intervention'].label = 'PREV';
        this.buttons['prev_intervention'].on_click = function (d) {
                self.prev_interventon(d);
            };


        this.buttons['next_intervention'] = new ButtonBase(new Rect(1200,200, 50,100));
        this.buttons['next_intervention'].active = true;
        this.buttons['next_intervention'].label = 'NEXT';
        this.buttons['next_intervention'].on_click = function (d) {
                self.next_interventon();
            };
    }
    
    update()
    {
        super.update();

        for (const [key, value] of Object.entries(this.buttons)) {
                this.buttons[key].update();
        }
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

        if (card_index < interventions.length) {
            let card_info = interventions[card_index];
            let bg_col = 'rgb(127,127,127)';

            if (card_info['type'] == 'ET'){
                bg_col = 'rgb(0,255,0)';
            }

            if (card_info['type'] == 'BD'){
                bg_col = 'rgb(255,255,0)';
            }

            if (card_info['type'] == 'DP'){
                bg_col = 'rgb(0,255,255)';
            }

            if (card_info['type'] == 'FP'){
                bg_col = 'rgb(255,0,255)';
            }


            GAZCanvas.Rect(new Rect(offset.x, offset.y, 270, 395), bg_col);

            let max_line_length = 20;

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
        super.draw();

        GAZCanvas.clip_start();
        //GAZCanvas.clip_rect(GAZCanvas.toScreenSpace(new Rect(10, 20, 800, 900)));

        for(let i=0;i<4;i++) {
            this.draw_card(new Vector2(80 + (i * (270 + 10)), 70), i+this.first_intervention);
        }

        GAZCanvas.clip_end();

        for(let i=0;i<5;i++) {
            this.draw_card(new Vector2(80 + (i * (270 + 10)), 70 +410), i+4);
        }

        for (const [key, value] of Object.entries(this.buttons)) {
            this.buttons[key].draw();
        }


        this.draw_mouse_pointer();
    }
}

appInst = new ARSINOEGame();
