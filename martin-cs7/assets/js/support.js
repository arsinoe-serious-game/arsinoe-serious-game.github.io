function open_page_in_new_window(url){
    console.log(screen.width.toString() +'x' + screen.height.toString());

    let s = '';
    s += 'location=yes,scrollbars=yes,status=yes,';
    s += 'height='+(screen.height/2).toString()+'px';
    s+=',';
    s += 'width='+(screen.width/2).toString()+'px';
    s+=',';
    s += 'left='+(screen.width/4).toString()+'px';
    s+=',';
    s += 'top='+(screen.height/4).toString()+'px';

    console.log(url +' ' +s);

    window.open(url, '', s);
}