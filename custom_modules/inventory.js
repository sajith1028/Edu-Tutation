let conn;

const init = (connection) => {
    conn = connection;
}

function makeQuery(sql, callback, logPoint) {
    conn.query(sql, (err, result) => {
        if(err) {
            console.log(`Error occurred while ${logPoint}`);
            callback(false);
            throw err;
        }
        console.log('success!');
        return callback(result);
    });
}

const addItem = (unit, description, remarks, callback) => {
    const sql = `INSERT INTO item (unit, description, remarks) VALUES ('${unit}', '${description}', '${remarks}')`;
    makeQuery(sql, callback, 'inserting item');
};

const removeItem = (itID, callback) => {
    const sql = `DELETE FROM item WHERE itID='${itID}'`;
    makeQuery(sql, callback, 'removing item');
};

const getAllItems = (callback) => {
    const sql = `SELECT * FROM item`;
    makeQuery(sql, callback, 'retrieving items');
};

const addToReceivedItems = (itID, qty, remarks, callback) => {
    const sql = `INSERT INTO received_item (itID, qty, remarks) VALUES ('${itID}', '${qty}', '${remarks}')`;
    console.log(sql);
    makeQuery(sql, callback, 'inserting to received items');
};

const getAllReceivedItems = (callback) => {
    const sql = `SELECT rt.*, it.description, it.unit FROM received_item rt INNER JOIN item it ON rt.itID = it.itID`;
    makeQuery(sql, callback, 'removing item');
};

const addToIssuedItems = (itID, qty, remarks, callback) => {
    const sql = `INSERT INTO issued_item(itID, qty, remarks) VALUES ('${itID}', '${qty}', '${remarks}')`;
    makeQuery(sql, callback, 'inserting to issued items');
};

const getAllIssuedItems = (callback) => {
    const sql = `SELECT isit.*, it.description, it.unit FROM issued_item isit INNER JOIN item it ON isit.itID = it.itID`;
    makeQuery(sql, callback, 'retrieving issued items');
};

const addToIssueRequests = (itID, subID, qty, callback) => {
    const sql = `INSERT INTO issue_request(itID, subID, qty) VALUES ('${itID}', '${subID}', '${qty}')`;
    makeQuery(sql, callback, 'inserting to issue requests');
};

const getAllIssueRequests = (callback) => {
    const sql = `SELECT isrq.*, it.description, it.unit, it.inStockQty FROM issue_request isrq INNER JOIN item it ON isrq.itID = it.itID`;
    makeQuery(sql, callback, 'retrieving all issue requests');
}

const acceptIssueRequest = (reqID, remarks, callback) => {
    let sql = `SELECT qty, itID FROM issue_request WHERE reqID='${reqID}'`; 
    makeQuery(sql, (res1) => {
        if(!res1) {
            callback(false);
            return;
        }
        const qty = res1[0].qty;
        const itID = res1[0].itID;
        sql = `SELECT inStockQty FROM item WHERE itID='${itID}'`;
        makeQuery(sql, (res2) => {
            if(!res2) {
                callback(false);
                return;
            }
            const inStockQty = res2[0].inStockQty;
            if(qty > inStockQty) {
                callback(false);
                return;
            }
            sql = `CALL accept_request(${reqID}, '${remarks}')`;
            makeQuery(sql, callback, 'calling accept_request procedure');
        }, 'retrieving inStockQty');
    }, 'retrieving issue request qty');
};

const denyIssueRequest = (reqID, callback) => {
    const sql = `CALL deny_request(${reqID})`;
    makeQuery(sql, callback, 'calling deny_request procedure');
};

const getIssueRequestStatus = (reqID, callback) => {
    const sql = `SELECT accepted FROM issue_request WHERE reqID = '${reqID}'`;
    makeQuery(sql, (result) => {
        if(result[0].accepted) {
            callback(true);
            return;
        }
        callback(false);
    }, 'retrieving issue request status');
}


const getInventoryRequest = (reqID, callback) => {
    const sql = `SELECT * FROM issue_request WHERE reqID = '${reqID}'`;
    makeQuery(sql, (result) => {
        callback(result[0]);
    }), 'retrieving issue request';
};


module.exports = {
    init,
    addItem,
    removeItem,
    getAllItems,
    addToReceivedItems,
    getAllReceivedItems,
    addToIssuedItems,
    getAllIssuedItems,
    addToIssueRequests,
    getAllIssueRequests,
    acceptIssueRequest,
    denyIssueRequest,
    getIssueRequestStatus
};