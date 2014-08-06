var mysql   = require('mysql'),
    Promise = require('bluebird');

// Set up DB
{
    var db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'toor'
    });

    db = Promise.promisifyAll(db);
    db.connect();
    db.query('USE swippl');
}

// Reset db
{
    function initDatabase() {

        console.log('INITIALIZING DATABASE. BEEP.');

        // Prep DB
        db.query('DROP DATABASE swippl');
        db.query('CREATE DATABASE swippl');
        db.query('USE swippl');

	db.query('CREATE TABLE Users (UserID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT, Username VARCHAR(25) NOT NULL, Password VARCHAR(40) NOT NULL, Email VARCHAR(25), ProfilePhoto VARCHAR(100), ShowNSFW BOOLEAN NOT NULL DEFAULT 0, Deleted BOOLEAN NOT NULL DEFAULT 0, Updated TIMESTAMP NOT NULL, Created TIMESTAMP NOT NULL, LastLogin TIMESTAMP, CONSTRAINT uc_Username UNIQUE (Username) );');
        db.query('CREATE TABLE Photos (PhotoID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT, SubmitterID INT UNSIGNED NOT NULL, ImgUrl VARCHAR(50) NOT NULL, LocalUrl VARCHAR(255), Views INT NOT NULL DEFAULT 0, IsNSFW BOOLEAN NOT NULL DEFAULT 0, Deleted BOOLEAN NOT NULL DEFAULT 0, Updated TIMESTAMP NOT NULL, Created TIMESTAMP NOT NULL, FOREIGN KEY (SubmitterID) REFERENCES Users(UserID) );');
        db.query('CREATE TABLE Votes (VoteID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT, PhotoID INT UNSIGNED NOT NULL, VoterID INT UNSIGNED NOT NULL, Vote INT NOT NULL, Score INT, SampleSize INT, Prediction FLOAT, Correct BOOLEAN, Created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (PhotoID) REFERENCES Photos(PhotoID), FOREIGN KEY (VoterID) REFERENCES Users(UserID), CONSTRAINT uc_UserVotes UNIQUE (PhotoID, VoterID));');
        db.query('CREATE TABLE TagTypes (TagTypeID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT, TagName VARCHAR(25) NOT NULL, CannonicalTagID INT UNSIGNED, Updated TIMESTAMP NOT NULL, Created TIMESTAMP NOT NULL, FOREIGN KEY (CannonicalTagID) REFERENCES TagTypes(TagTypeID), CONSTRAINT uc_TagTypes UNIQUE (TagName) );');
        db.query('CREATE TABLE Tags (TagID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT, TaggedBy INT UNSIGNED NOT NULL, PhotoID INT UNSIGNED NOT NULL, TagTypeID INT UNSIGNED NOT NULL, Deleted BOOLEAN NOT NULL DEFAULT 0, Updated TIMESTAMP NOT NULL, Created TIMESTAMP NOT NULL, FOREIGN KEY (TaggedBy) REFERENCES Users(UserID), FOREIGN KEY (PhotoID) REFERENCES Photos(PhotoID), FOREIGN KEY (TagTypeID) REFERENCES TagTypes(TagTypeID), CONSTRAINT uc_UserTag UNIQUE (TaggedBy, PhotoID, TagTypeID) );');


        var users = [
            ['joshua', 'hunter2', 'joshua@huttj.com', 1],
            ['bill', 'hunter2', '', 1],
            ['james', 'hunter2', 'james@teamrocket.com', 1],
            ['jesse', 'hunter2', '', 1]
        ];

        for (var i = 0; i < users.length; i++) {
            db.query("INSERT INTO Users (Username, Password, Email, ShowNSFW) VALUES (?, ?, ?, ?)", users[i]);
        }

        var photos = [
            [1, 'http://i.imgur.com/kXS9N9d.jpg', 1],
            [2, 'http://i.imgur.com/IrMPajA.gif', 0],
            [3, 'http://i.imgur.com/7vbiNma.gif', 0],
            [1, 'http://i.imgur.com/ufUuPse.jpg', 0],
            [2, 'http://i.imgur.com/YXESz7X.jpg', 0],
            [3, 'http://i.imgur.com/GLFoVRp.jpg', 1],
            [1, 'http://i.imgur.com/ceSgtWr.jpg', 0],
            [2, 'http://i.imgur.com/KmtF1uL.png', 1],
            [3, 'http://i.imgur.com/fJw6it2.jpg', 0],
            [1, 'http://i.imgur.com/haqnPzs.jpg', 0],
            [2, 'http://i.imgur.com/KyAFKm1.png', 0],
            [3, 'http://i.imgur.com/egjkOe9.jpg', 0],
            [1, 'http://i.imgur.com/GaLnmEk.jpg', 0],
            [2, 'http://i.imgur.com/E58B2ef.png', 0],
            [3, 'http://i.imgur.com/GnruiML.png', 0],
            [1, 'http://i.imgur.com/PD8trdI.jpg', 0],
            [2, 'http://i.imgur.com/P3YdTgK.png', 0],
            [3, 'http://i.imgur.com/BOEThUa.jpg', 0],
            [1, 'http://i.imgur.com/UtpUz2Y.png', 0],
            [2, 'http://i.imgur.com/RMOEHrL.gif', 1],
            [3, 'http://i.imgur.com/iw1AzDU.gif', 1],
            [1, 'http://i.imgur.com/lzKB52Q.gif', 1],
            [2, 'http://i.imgur.com/DqHQ4t0.jpg', 0],
            [3, 'http://i.imgur.com/VjcAOir.png', 0],
            [1, 'http://i.imgur.com/lRVFIXa.jpg', 0],
            [3, 'http://i.imgur.com/hZr2F14.jpg', 0],
            [1, 'http://i.imgur.com/uHEl88V.jpg', 0],
            [2, 'http://i.imgur.com/ZOXL6er.jpg', 1],
            [3, 'http://i.imgur.com/SeS7qIR.jpg', 0],
            [3, 'http://i.imgur.com/McZWSWH.gif', 1],
            [1, 'http://i.imgur.com/jEP4ySF.jpg', 0],
            [2, 'http://i.imgur.com/Rq4diM8.gif', 0],
            [3, 'http://i.imgur.com/1D33thu.gif', 0],
            [1, 'http://i.imgur.com/nd7i5fq.jpg', 1],
            [2, 'http://i.imgur.com/F5XOYH7.jpg', 0],
            [3, 'http://i.imgur.com/9yHZJKE.jpg', 1],
            [1, 'http://i.imgur.com/785Ax83.jpg', 0],
            [2, 'http://i.imgur.com/kNLKyEP.png', 0],
            [3, 'http://i.imgur.com/JxY80Pa.jpg', 1],
            [1, 'http://i.imgur.com/kqvAaAs.png', 0],
            [2, 'http://i.imgur.com/bDlicqx.gif', 0],
            [3, 'http://i.imgur.com/WktFupP.jpg', 0],
            [1, 'http://i.imgur.com/VPOsS6V.png', 1],
            [2, 'http://i.imgur.com/e7xxIPA.jpg', 1],
            [3, 'http://i.imgur.com/5qU2ayB.jpg', 0],
            [1, 'http://i.imgur.com/QGPnsIY.jpg', 0],
            [2, 'http://i.imgur.com/aTsXnGN.jpg', 0],
            [3, 'http://i.imgur.com/I3lAv41.jpg', 0],
            [1, 'http://i.imgur.com/HekeEK5.gif', 0],
            [2, 'http://i.imgur.com/Aco3J5U.jpg', 0],
            [3, 'http://i.imgur.com/yU8rBQp.jpg', 0],
            [1, 'http://i.imgur.com/0JkHngn.jpg', 0],
            [2, 'http://i.imgur.com/8dwPfkW.jpg', 1],
            [3, 'http://i.imgur.com/GyBlkvi.jpg', 0],
            [1, 'http://i.imgur.com/gF2kZSW.jpg', 0],
            [2, 'http://i.imgur.com/Dj3F2jE.jpg', 1],
            [3, 'http://i.imgur.com/7uC6Lal.jpg', 0],
            [1, 'http://i.imgur.com/IIFCn6Y.jpg', 1],
            [2, 'http://i.imgur.com/aQFQCn5.jpg', 1],
            [3, 'http://i.imgur.com/ee0sIBB.jpg', 1],
            [1, 'http://i.imgur.com/wu6ygwN.jpg', 1],
            [2, 'http://i.imgur.com/CvzrNJL.png', 0],
            [3, 'http://i.imgur.com/6H17ygE.jpg', 0],
            [1, 'http://i.imgur.com/dIpbV1I.gif', 0],
            [2, 'http://i.imgur.com/WHxuHdt.gif', 0],
            [3, 'http://i.imgur.com/S2gAkQK.png', 0],
            [1, 'http://i.imgur.com/TfzZ4a5.png', 0],
            [2, 'http://i.imgur.com/jTaTwDb.jpg', 0],
            [3, 'http://i.imgur.com/005RuCX.gif', 0],
            [1, 'http://i.imgur.com/p8IckVv.gif', 0],
            [2, 'http://i.imgur.com/qodOhpQ.gif', 0],
            [3, 'http://i.imgur.com/s2IKrad.gif', 1],
            [1, 'http://i.imgur.com/JgJhb2Q.jpg', 0],
            [2, 'http://i.imgur.com/iWfknsk.gif', 0],
            [3, 'http://i.imgur.com/Aj5JJvp.jpg', 0],
            [1, 'http://i.imgur.com/sTIWRdi.gif', 0],
            [2, 'http://i.imgur.com/AS8ElDx.gif', 0],
            [3, 'http://i.imgur.com/A1KpvZm.png', 0],
            [1, 'http://i.imgur.com/zmUsWPe.jpg', 0],
            [2, 'http://i.imgur.com/NbvGBVW.jpg', 0],
            [3, 'http://i.imgur.com/C1DOXGU.gif', 0],
            [1, 'http://i.imgur.com/7RhNqvY.jpg', 0],
            [2, 'http://i.imgur.com/7wAvoW4.gif', 0],
            [3, 'http://i.imgur.com/jA2QCz0.jpg', 1],
            [1, 'http://i.imgur.com/8TdrIXk.jpg', 0],
            [2, 'http://i.imgur.com/mid9KNf.jpg', 1],
            [3, 'http://i.imgur.com/2Sx5mZ0.jpg', 0],
            [1, 'http://i.imgur.com/S4mGCJi.jpg', 1],
            [2, 'http://i.imgur.com/Pu3ZGP8.jpg', 0],
            [3, 'http://i.imgur.com/38vobF7.jpg', 0],
            [1, 'http://i.imgur.com/h6pZbKc.gif', 0],
            [2, 'http://i.imgur.com/mRNcuK8.gif', 1],
            [3, 'http://i.imgur.com/FqSOUd0.jpg', 0],
            [1, 'http://i.imgur.com/rLN3rXd.jpg', 1],
            [2, 'http://i.imgur.com/Pg8yjcg.gif', 0],
            [3, 'http://i.imgur.com/ovUfHiW.gif', 0],
            [1, 'http://i.imgur.com/FSHEfOt.gif', 0],
            [2, 'http://i.imgur.com/dRsslcK.jpg', 0],
            [3, 'http://i.imgur.com/mEO6wEi.jpg', 0],
            [1, 'http://i.imgur.com/GtfzLXM.gif', 0],
            [2, 'http://i.imgur.com/YIxOZSv.jpg', 0],
            [3, 'http://i.imgur.com/haQEiSO.jpg', 0],
            [1, 'http://i.imgur.com/yqRT8uT.jpg', 0],
            [2, 'http://i.imgur.com/Pj3iFdY.gif', 0],
            [3, 'http://i.imgur.com/OXdsYKv.jpg', 0],
            [1, 'http://i.imgur.com/zJasrDU.gif', 0],
            [2, 'http://i.imgur.com/G6Gzs6i.jpg', 0],
            [3, 'http://i.imgur.com/lLE7twd.jpg', 0],
            [1, 'http://i.imgur.com/4iRh3ua.jpg', 0],
            [2, 'http://i.imgur.com/PyMOoJn.jpg', 0],
            [3, 'http://i.imgur.com/GSHwYNQ.jpg', 0],
            [1, 'http://i.imgur.com/ir3GAwn.jpg', 0],
            [2, 'http://i.imgur.com/lpjwpGL.png', 0],
            [3, 'http://i.imgur.com/EyhGwA2.jpg', 0],
            [1, 'http://i.imgur.com/vjBDlLK.gif', 1],
            [2, 'http://i.imgur.com/8ffVx8L.jpg', 0],
            [3, 'http://i.imgur.com/2InLlu2.jpg', 0],
            [1, 'http://i.imgur.com/gxGSoKe.jpg', 1],
            [2, 'http://i.imgur.com/hxrZ84G.jpg', 0],
            [3, 'http://i.imgur.com/q4QmA5Y.jpg', 0],
            [1, 'http://i.imgur.com/8vvbpi2.jpg', 0],
            [2, 'http://i.imgur.com/VaJiZ2F.jpg', 0],
            [3, 'http://i.imgur.com/i4lrzOj.jpg', 0],
            [1, 'http://i.imgur.com/XEiq36O.jpg', 1],
            [2, 'http://i.imgur.com/FORcztM.jpg', 0],
            [3, 'http://i.imgur.com/C5mGhKb.gif', 0],
            [1, 'http://i.imgur.com/iR36SFL.jpg', 1],
            [2, 'http://i.imgur.com/ThRoCBd.jpg', 0],
            [3, 'http://i.imgur.com/0Ovcabh.gif', 0],
            [1, 'http://i.imgur.com/oeNGje1.gif', 0],
            [2, 'http://i.imgur.com/C1Ugsn4.jpg', 0],
            [3, 'http://i.imgur.com/LYYlNlD.jpg', 0],
            [1, 'http://i.imgur.com/tuulpgK.jpg', 0],
            [2, 'http://i.imgur.com/voadbgS.jpg', 0],
            [3, 'http://i.imgur.com/ARMnhLN.gif', 0],
            [1,"http://i.imgur.com/ACBixG1.jpg",0],
            [1,"http://i.imgur.com/ptgyTtC.jpg",0],
            [1,"http://i.imgur.com/XSXxGly.jpg",0],
            [1,"http://i.imgur.com/2SHhSYu.jpg",0],
            [1,"http://i.imgur.com/GUtk7Y0.jpg",0],
            [1,"http://i.imgur.com/nD87Awk.jpg",0],
            [1,"http://i.imgur.com/Ee7w9Uv.jpg",0],
            [1,"http://i.imgur.com/D1HFH1E.jpg",0],
            [1,"http://i.imgur.com/3RBfcgb.jpg",0],
            [1,"http://i.imgur.com/8p3skbA.jpg",0],
            [1,"http://i.imgur.com/bKI1tT1.jpg",0],
            [1,"http://i.imgur.com/AMBuNLR.jpg",0],
            [1,"http://i.imgur.com/OqfZ7do.jpg",0],
            [1,"http://i.imgur.com/PCUo36R.jpg",0],
            [1,"http://i.imgur.com/97xDqTy.jpg",0],
            [1,"http://i.imgur.com/HjRgpRx.jpg",0],
            [1,"http://i.imgur.com/cbO6yBq.jpg",0],
            [1,"http://i.imgur.com/5Cq3cEa.jpg",0],
            [1,"http://i.imgur.com/Smn1G0P.jpg",0],
            [1,"http://i.imgur.com/IHFN2c8.jpg",0],
            [1,"http://i.imgur.com/d2wOVRD.jpg",0],
            [1,"http://i.imgur.com/K9tAvet.jpg",0],
            [1,"http://i.imgur.com/AupaOZs.jpg",0],
            [1,"http://i.imgur.com/v5Jfcw3.jpg",0],
            [1,"http://i.imgur.com/CYTCj5K.jpg",0],
            [1,"http://i.imgur.com/yFqtaP6.jpg",0],
            [1,"http://i.imgur.com/OjuHFC3.jpg",0]

        ];

        for (var j = 0; j < photos.length; j++) {
            db.query("INSERT INTO Photos (SubmitterID, ImgUrl, IsNSFW) VALUES (?, ?, ?)", photos[j]);
        }
    }
}

// User methods
{
    function getUser(userInfo) {
        var query = "SELECT * FROM Users WHERE UserID = ? OR Username = ? OR Email = ?";
        return db.queryAsync(query, [userInfo, userInfo, userInfo]).then(function (data) {
            return data[0][0];
        });
    }

    function createUser(user) {

        console.log(user);
        var query = "INSERT INTO Users (Username, Password, Email, ProfilePhoto, ShowNSFW) VALUES (?, ?, ?, ?, ?)";
        return db.queryAsync(query, [user.Username, user.Password, user.Email, user.ProfilePhoto, user.ShowNSFW || false]);
    }

    function deleteUser(userInfo) {
        var query = "UPDATE Users SET Deleted = 1 WHERE UserID = ?";
        return db.queryAsync(query, userInfo);
    }

    function updateUser(user) {
        var params = [];
        var query = "UPDATE Users SET ";
        if (user.Email) {
            query += "Email = ? "
            params.push(user.Email);
        }
        if (user.ShowNSFW) {
            query += "ShowNSFW = ? "
            params.push(user.ShowNSFW);
        }
        if (user.ProfilePhoto) {
            query += "ProfilePhoto = ? "
            params.push(user.ProfilePhoto);
        }
        params.push(user.UserID);
        query += "WHERE UserID = ?";
        if (params.length > 1) {
            return db.queryAsync(query, params);
        } else {
            var q = Promise.defer(false);
            return q.promise;
        }
    }

    function updateLastLogin(UserID) {
        var query = "UPDATE Users SET LastLogin = CURRENT_TIMESTAMP WHERE UserID = ?";
        return db.queryAsync(query, UserID);
    }
}

// Photo methods
{
    function getRandomPhoto() {
    }

    function getRandomSet(max) {
        var max = max || 10;
        max = Math.max(10, max);
        var query = "SELECT * FROM Photos WHERE IsNSFW = 0 ORDER BY RAND() LIMIT ?";
        return db.queryAsync(query, max).then(function (data) {
            return data[0];
        });
    }

    function getNextSetForUser(UserID) {
        if (strictlyNumeric(UserID)) {
            UserID = Number(UserID);

            // Oldest:
            //var query = "SELECT * FROM Photos WHERE PhotoID NOT IN (SELECT PhotoID FROM Votes WHERE VoterID = ?) AND IsNSFW <= (SELECT ShowNSFW FROM Users WHERE UserID = ?) ORDER BY RAND() LIMIT 10";

            // No recommendations:
            //var query = "SELECT Photos.* FROM Photos LEFT JOIN Votes ON Votes.PhotoID = Photos.PhotoID AND VoterID = ? AND Photos.IsNSFW <= (SELECT ShowNSFW FROM Users WHERE UserID = ?) WHERE VoterID IS NULL ORDER BY RAND() LIMIT 10;";

            // Naive recommentations:
//            var query = "SELECT NotSeen.*, Recommended.Confidence FROM (SELECT Photos.* FROM Photos LEFT JOIN Votes ON Votes.PhotoID = Photos.PhotoID AND VoterID = ? WHERE VoterID IS NULL AND Photos.IsNSFW <= (SELECT ShowNSFW FROM Users WHERE UserID = ?)) AS NotSeen "
//                      + "LEFT JOIN (SELECT PhotoID, SUM(Alike) / COUNT(Alike) AS Confidence FROM Votes "
//                      + "INNER JOIN (SELECT A.VoterID AS VoterA, B.VoterID AS VoterB, SUM(CASE WHEN A.Vote = 0 OR B.Vote = 0 THEN 0 WHEN A.Vote = B.Vote THEN 1 ELSE -1 END) / COUNT(A.Vote) AS Alike FROM Votes AS A "
//                      + "CROSS JOIN Votes AS B WHERE A.PhotoID = B.PhotoID AND A.VoterID <> B.VoterID AND A.VoterID = ? GROUP BY A.VoterID, B.VoterID HAVING Alike > 0 ORDER BY A.VoterID, Alike DESC) AS Rec "
//                      + "ON Votes.VoterID = Rec.VoterB WHERE Vote = 1 GROUP BY PhotoID) AS Recommended ON NotSeen.PhotoID = Recommended.PhotoID ORDER BY Confidence DESC LIMIT 10";

            var query = "SELECT Unseen.*, SUM(Votes.Vote) AS Score, COUNT(Vote) AS SampleSize, SUM(Rec.Alike * Vote) AS Prediction, "
                      + "SUM(Rec.Alike * Vote) * COUNT(Vote) AS ScaledPrediction FROM (SELECT Photos.* FROM Photos LEFT JOIN Votes "
                      + "ON Votes.PhotoID = Photos.PhotoID AND VoterID = ? WHERE VoterID IS NULL AND Photos.IsNSFW <= (SELECT ShowNSFW FROM "
                      + "Users WHERE UserID = ?)) AS Unseen LEFT JOIN Votes ON Unseen.PhotoID = Votes.PhotoID LEFT JOIN (SELECT A.VoterID AS VoterA,"
                      + " B.VoterID AS VoterB, SUM(CASE WHEN A.Vote = 0 OR B.Vote = 0 THEN 0 WHEN A.Vote = B.Vote THEN 1 ELSE -1 END) / COUNT(A.Vote) "
                      + "AS Alike FROM Votes AS A CROSS JOIN Votes AS B WHERE A.PhotoID = B.PhotoID AND A.VoterID <> B.VoterID AND A.VoterID = ? "
                      + "GROUP BY A.VoterID, B.VoterID HAVING Alike <> 0 ORDER BY A.VoterID, Alike DESC) AS Rec ON Rec.VoterB = Votes.VoterID "
                      + "GROUP BY PhotoID HAVING Prediction IS NULL OR SampleSize < 5 OR (SampleSize > 4 AND Prediction > 0) "
                      + "ORDER BY ScaledPrediction DESC, Score DESC LIMIT 5";

            return db.queryAsync(query, [UserID, UserID, UserID]).then(function (data) {
                console.log(data[0]);
                return data[0];
            });
        } else {
            var p = Promise.defer();
            p.reject();
            return p.promise;
        }
    }

    function getPhotoByID(photoID) {
        var query = "SELECT * FROM Photos WHERE PhotoID = ?";
        return db.queryAsync(query, photoID).then(function (data) {
            return data[0][0];
        });
    }

    function getPhotosByUser(userInfo) {
        var query = "SELECT * FROM Photos WHERE SubmitterID = (SELECT UserID FROM Users WHERE UserID = ? OR UserName = ? OR Email = ?)";
        return db.queryAsync(query, [userInfo, userInfo, userInfo]).then(function (data) {
            return data[0];
        });
    }

    function getLikedPhotos(UserID) {
        UserID = Number(UserID);
        query = "SELECT * FROM Photos WHERE PhotoID IN (SELECT PhotoID FROM Votes WHERE VoterID = ?)";
        return db.queryAsync(query, UserID).then(function (data) {
            return data[0];
        });
    }

    function getAllPhotos() {
        // var query = "SELECT * FROM photos WHERE IsNSFW = 0 ORDER BY RAND() LIMIT 10";
        var query = "SELECT Photos.* FROM Photos LEFT JOIN (SELECT Votes.PhotoID, SUM(Vote) AS Score FROM Votes GROUP BY Votes.PhotoID) AS Votes ON Photos.PhotoID = Votes.PhotoID WHERE Photos.IsNSFW = 0 ORDER BY Votes.Score DESC;";
        return db.queryAsync(query);
    }
}

// Voting methods
{
    function strictlyNumeric(/* */) {
        var list = Array.prototype.slice.call(arguments);
        return list.reduce(function (memo, n) {
            return memo && n.match(/^-?\d+$/) !== null;
        }, true);
    }

    function addVote(UserID, PhotoID, Vote, Score, SampleSize, Prediction) {
        // Our prediction is that the user will like it (or not). If the user does not vote
        // in accordance with the prediction, the prediction was incorrect. Thus, skipped
        // photos should count, as well.
        //
        // Quick validation:
        // +vote * +prediction > 0 == true;
        // -vote * -prediction > 0 == true;
        // -vote * +prediction > 0 == false;
        // +vote * -prediction > 0 == false;
        // 0vote * -prediction > 0 == false;
        // 0vote * 0prediction > 0 == false, but (0vote === 0) && (0prediction === 0) === true;
        var Correct = Vote && Prediction ? Vote * Prediction > 0 : (Vote === 0) && (Prediction === 0);

        console.log([UserID, PhotoID, Vote, Score, SampleSize, Prediction, Correct]);

        var query = "INSERT INTO Votes (VoterID, PhotoID, Vote, Score, SampleSize, Prediction, Correct) VALUES (?, ?, ?, ?, ?, ?, ?)";
        return db.queryAsync(query, [UserID, PhotoID, Vote, Score, SampleSize, Prediction, Correct]);
    }
}

module.exports = {
    initDatabase: initDatabase,
    users: {
        get: getUser,
        create: createUser,
        update: updateUser,
        delete: deleteUser,
        updateLastLogin: updateLastLogin
    },
    photos: {
        get: {
            nextPhoto: getRandomPhoto,
            nextSet: getRandomSet,
            byID: getPhotoByID,
            byUser: getPhotosByUser,
            nextSetForUser: getNextSetForUser,
            all: getAllPhotos
        }
    },
    votes: {
        add: addVote,
        get: {
            liked: getLikedPhotos
        }
    }
}
