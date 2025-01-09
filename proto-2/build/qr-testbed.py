import qrcode
img = qrcode.make('https://www.espncricinfo.com/series/big-bash-league-2024-25-1443056/melbourne-stars-vs-sydney-sixers-28th-match-1443084/live-cricket-score')
type(img)  # qrcode.image.pil.PilImage
img.save("some_file.png")