module.exports = {
    get: (req, res) => {
        res.json({message: 'Get success!'})
    },
    detail: (req, res) => {
        res.json({message: 'Detail success!'})
    },
    update: (req, res) => {
        res.json({message: 'Update success!'})
    },
    store: (req, res) => {
        res.json({message: 'Insert success!'})
    },
    delete: (req, res) => {
        res.json({message: 'Delete success!'})
    }
}