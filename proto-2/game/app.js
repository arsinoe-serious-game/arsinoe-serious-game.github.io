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

    draw_card(offset){
        GAZCanvas.Rect(new Rect(offset.x, offset.y, 270,395), 'rgb(255,255,255)');
        GAZCanvas.Text(20, "BUILD A SEA WALL", new Vector2(offset.x + 270/2, offset.y+20), 'rgb(0,0,0)','center', 'roboto', 'bold');

        GAZCanvas.Sprite(this.image, new Rect(offset.x+46, offset.y+48, 175,125));

        let text = 'The coast road community is plagued by coastal\novertopping, causing disruption to the main coast road\nand flooding local shops and houses. Building a sea wall\nshould reduce this almost yearly event.\n';
        GAZCanvas.Text(10, text, new Vector2(offset.x + 270/2, offset.y+190), 'rgb(0,0,0)','center', 'roboto', '');

        let y = offset.y+233;

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
        GAZCanvas.Text(10, "+1", new Vector2(offset.x + 43, y), 'rgb(0,0,0)','center', 'roboto', 'bold');
        GAZCanvas.Text(10, "-1", new Vector2(offset.x + 91, y), 'rgb(0,0,0)','center', 'roboto', 'bold');
        GAZCanvas.Text(10, "+2", new Vector2(offset.x + 138, y), 'rgb(0,0,0)','center', 'roboto', 'bold');
        GAZCanvas.Text(10, "-2", new Vector2(offset.x + 181, y), 'rgb(0,0,0)','center', 'roboto', 'bold');
        GAZCanvas.Text(10, "0", new Vector2(offset.x + 226, y), 'rgb(0,0,0)','center', 'roboto', 'bold');
    }
    
    draw()
    {
        super.draw();

        for(let i=0;i<4;i++) {
            this.draw_card(new Vector2(80 + (i * (270 + 10)), 70));
        }

        for(let i=0;i<5;i++) {
            this.draw_card(new Vector2(80 + (i * (270 + 10)), 70 +410));
        }


        this.draw_mouse_pointer();
    }
}

appInst = new ARSINOEGame();
