class ARSINOEGame extends AppBase
{
    constructor()
    {
        super();

        this.image = new Image();
    }
    
    oneTimeInit()
    {
        super.oneTimeInit(1600,900);

        this.image.src = "assets/interventions/intervention-0.png";
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

        let card_info = interventions[card_index];

        GAZCanvas.Rect(new Rect(offset.x, offset.y, 270,395), 'rgb(255,255,255)');

        let max_line_length = 20;
        if (card_info['name'].length > max_line_length) {
            GAZCanvas.Text(15, this.format_desc(card_info['name'].toUpperCase(),max_line_length), new Vector2(offset.x + 270 / 2, offset.y + 20-2), 'rgb(0,0,0)', 'center', 'roboto', 'bold');
        }else {
            GAZCanvas.Text(20, card_info['name'].toUpperCase(), new Vector2(offset.x + 270 / 2, offset.y + 20), 'rgb(0,0,0)', 'center', 'roboto', 'bold');
        }

        GAZCanvas.Sprite(this.image, new Rect(offset.x+46, offset.y+48, 175,125));

        let text = this.format_desc(card_info['desc'], 55);
        GAZCanvas.Text(10, text, new Vector2(offset.x + 270/2, offset.y+190), 'rgb(0,0,0)','center', 'roboto', '');

        let y = offset.y+190+ ((text.split('\n').length) * 12) - 10;

        y+=5;

        GAZCanvas.Text(10, "Positives", new Vector2(offset.x + 26, y), 'rgb(0,0,0)','left', 'roboto', 'bold');
        y += 12;
        GAZCanvas.Text(10, "1.Minimise flooding risk to the coast road community", new Vector2(offset.x + 26, y), 'rgb(0,0,0)','left', 'roboto', '');
        y += 12;
        GAZCanvas.Text(10, "2.Reduce clean-up costs", new Vector2(offset.x + 26, y), 'rgb(0,0,0)','left', 'roboto', '');
        y += 12;
        GAZCanvas.Text(10, "3.Increase investment into the area", new Vector2(offset.x + 26, y), 'rgb(0,0,0)','left', 'roboto', '');
        y += 12;

        y+=5;
        GAZCanvas.Text(10, "Potential Issues", new Vector2(offset.x + 26, y), 'rgb(0,0,0)','left', 'roboto', 'bold');
        y += 12;
        GAZCanvas.Text(10, "1.Disruption during building works", new Vector2(offset.x + 26, y), 'rgb(0,0,0)','left', 'roboto', '');
        y += 12;
        GAZCanvas.Text(10, "2.May ruin the view of the bay", new Vector2(offset.x + 26, y), 'rgb(0,0,0)','left', 'roboto', '');
        y += 12;
        GAZCanvas.Text(10, "3.Only protects locally", new Vector2(offset.x + 26, y), 'rgb(0,0,0)','left', 'roboto', '');
        y += 12;

        
        y = offset.y+333 +18;
        GAZCanvas.Rect(new Rect(offset.x+25, y, 222,16), 'rgb(28,96,126)');


        y+=8 +1;
        GAZCanvas.Text(10, "EP", new Vector2(offset.x + 43, y), 'rgb(255,255,255)','center', 'roboto', 'bold');
        GAZCanvas.Text(10, "BP", new Vector2(offset.x + 91, y), 'rgb(255,255,255)','center', 'roboto', 'bold');
        GAZCanvas.Text(10, "FP", new Vector2(offset.x + 138, y), 'rgb(255,255,255)','center', 'roboto', 'bold');
        GAZCanvas.Text(10, "DP", new Vector2(offset.x + 181, y), 'rgb(255,255,255)','center', 'roboto', 'bold');
        GAZCanvas.Text(10, "TP", new Vector2(offset.x + 226, y), 'rgb(255,255,255)','center', 'roboto', 'bold');



        y += 8;
        GAZCanvas.Rect(new Rect(offset.x+25, y, 222,16), 'rgb(210,210,210)');
        y += 8;
        GAZCanvas.Text(10, card_info['EP'], new Vector2(offset.x + 43, y), 'rgb(0,0,0)','center', 'roboto', 'bold');
        GAZCanvas.Text(10, card_info['BP'], new Vector2(offset.x + 91, y), 'rgb(0,0,0)','center', 'roboto', 'bold');
        GAZCanvas.Text(10, card_info['FP'], new Vector2(offset.x + 138, y), 'rgb(0,0,0)','center', 'roboto', 'bold');
        GAZCanvas.Text(10, card_info['DP'], new Vector2(offset.x + 181, y), 'rgb(0,0,0)','center', 'roboto', 'bold');
        GAZCanvas.Text(10, card_info['TP'], new Vector2(offset.x + 226, y), 'rgb(0,0,0)','center', 'roboto', 'bold');
    }
    
    draw()
    {
        super.draw();

        for(let i=0;i<4;i++) {
            this.draw_card(new Vector2(80 + (i * (270 + 10)), 70), i);
        }

        for(let i=0;i<5;i++) {
            this.draw_card(new Vector2(80 + (i * (270 + 10)), 70 +410), i+4);
        }


        this.draw_mouse_pointer();
    }
}

appInst = new ARSINOEGame();
