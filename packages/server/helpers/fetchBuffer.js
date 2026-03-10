async function fetchBuffer(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch file: ${res.status}`);
    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
}

module.exports = fetchBuffer;
