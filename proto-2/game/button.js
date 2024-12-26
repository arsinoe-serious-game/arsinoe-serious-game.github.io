/*
    ButtonBase - base button class
 */
class ButtonBase extends Rect
{
    constructor(inRect)
    {
        super(inRect.x,inRect.y,inRect.w,inRect.h);
        this.active = false;
        this.selected = false;
    }

    label()
    {
        return "add label";
    }
    
    isInRect(pos)
    {
        if(this.active === false)
        {
            return false;
        }
        return this.isInMe(pos);
    }
    
    update()
    {
    
    }
    
    draw()
    {
        //let rect = toScreenSpace(this.rect);
        
        let fontSize = GAZCanvas.toScreenSpace(new Rect(0,0,24,24) ).h;
        
        if(this.active === false)
        {
            GAZCanvas.Rect(this, 'rgb(255,127,127)') ;
        }
        else
        {
            if(this.selected === true)
            {
                GAZCanvas.Rect(this, 'rgb(127,127,255)');
            }
            else
            {
                if (this.isInMe(Input.mouseLogicalPos) === true)
                {
                    GAZCanvas.Rect(this, 'rgb(0,255,255)');
                }
                else
                {
                    GAZCanvas.Rect(this, 'rgb(0,255,0)');
                }
            }
        }
        
        
        let pos = this.getCentre();
        
        GAZCanvas.Text(24,this.label(), pos,"#ffffff",'center','Noto Sans');
    }
}



//======================================================================================================================

/*
    KeyButton - button for handling musical key
 */
class KeyButton extends ButtonBase
{
    constructor(label,rect)
    {
        super(rect);
        this.labelText = label;
        
        this.active = true;
    }
    
    label()
    {
        return this.labelText;
    }
}

//======================================================================================================================

/*
    ModeButton -    button that holds mode object
                    This may be better served by putting all the mode information into the fretboard class (or mode db)
                    and having the button just set the name of the current mode.
 */
class ModeButton extends ButtonBase
{
    constructor(mode,rect)
    {
        super(rect);
        
        this.mode = mode;
        this.active = true;
        this.selected = false;
    }
    
    label()
    {
        return this.mode.label;
    }
}
