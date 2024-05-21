import fetch from 'node-fetch'
let timeout = 120000
let poin = 4999
let handler = async (m, {
    conn,
    command,
    usedPrefix
}) => {
    conn.tebakchara = conn.tebakchara ? conn.tebakchara : {}
    let id = m.chat
    if (id in conn.tebakchara) {
        conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakchara[id][0])
        throw false
    }
    let res = await fetch('https://api.jikan.moe/v4/characters')
    let jsons = await res.json()
    let jso = jsons.data
    let json = jso.getRandom()
    let caption = `*${command.toUpperCase()}*
Siapakah nama dari gambar ini

Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik ${usedPrefix}hcha untuk hint
Bonus: ${poin} XP
    `.trim()
    conn.tebakchara[id] = [
        await conn.sendFile(m.chat, json.images.jpg.image_url, '', caption, m),
        json, poin,
        setTimeout(() => {
            if (conn.tebakchara[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.name}*\nKanji : ${json.name_kanji}\n*Url :* ${json.url}\n*Desk :* ${json.about}`, conn.tebakchara[id][0])
            delete conn.tebakchara[id]
        }, timeout)
    ]
}
handler.help = ['tebakchara']
handler.tags = ['game']
handler.command = /^tebakchara/i

export default handler

const buttons = [
    ['Hint', '/hcha'],
    ['Nyerah', 'menyerah']
]