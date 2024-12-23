class Fretboard extends AppBase
{
    constructor()
    {
        super();
    }
    
    oneTimeInit()
    {
        super.oneTimeInit(1600,900);
    }
    
    update()
    {
        super.update();
    }
    
    draw()
    {
        super.draw();

        this.draw_mouse_pointer();
    }
}

appInst = new Fretboard();
