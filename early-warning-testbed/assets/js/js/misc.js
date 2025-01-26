class Random {
    constructor(value) {
       this.seed = 0;
       this.currentValue = 0;
        this.init(value);
    }

    init(value) {
        this.seed = value;
        this.currentValue = this.seed;
    }

    next() {
        this.currentValue += this.seed;
        this.currentValue ^= 353562;

        while(this.currentValue < 0){
            this.currentValue += 353562;
        }

        return this.currentValue;
    }

    reset() {
        this.currentValue = this.seed;
    }

    getInt(min, max) {
        if (min == max) return min;
        var val = this.next() % 10000;
        return Math.floor(((val / 10000.0) * (max - min)) + min);
    }

    getFloat(min, max) {
        if (min == max) return min;
        var val = this.next() % 10000;
        return (((val / 10000.0) * (max - min)) + min);
    }

    getRandomColor(I) {
        var r,g,b;

        if (I===undefined){
            I = 0;
        }

        I = Math.max(Math.min(255,I),0);
        do{
            r= this.getInt(0,255);
            g= this.getInt(0,255);
            b= this.getInt(0,255);

        }while ((r < I) && (g < I) && (b<I));
        var color = '#';
        color += r.toString(16).padStart(2,'0').toLowerCase();
        color += g.toString(16).padStart(2,'0').toLowerCase();
        color += b.toString(16).padStart(2,'0').toLowerCase();

      return color;
    }
}

let random_colour_rand = new Random(1234);

function getRandomColor() {
  var letters = '0123456789ABC';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[random_colour_rand.getInt(0, letters.length)];
  }
  return color;
}
