from psd_tools import PSDImage

psd = PSDImage.open('/Users/gareth/Documents/dev/arsinoe/arsinoe-serious-game.github.io/proto-2/build/Untitled.psd')
#psd.composite().save('example.png')

def do_layer(layer, indent):

    text = ''
    for i in range(0,indent):
        text += '\t'

    if layer.kind == 'pixel':
        print(text + layer.name +' pixel map' + str(layer.offset) +' ' + str(layer.size))
    else:
        print(text + layer.name + ' group' + str(layer.offset) +' ' + str(layer.size))
        for l in layer:
            do_layer(l, indent + 1)


for layer in psd:
    do_layer(layer, 0)
