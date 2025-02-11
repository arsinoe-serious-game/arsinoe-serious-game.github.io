import qrcode
img = qrcode.make('https://www.exeter.ac.uk/research/centres/cws/')
type(img)  # qrcode.image.pil.PilImage
img.save("game/assets/cws_qr.png")