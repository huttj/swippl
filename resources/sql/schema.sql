DROP DATABASE swippl;
CREATE DATABASE swippl;
USE swippl;

CREATE TABLE Users
(
     UserID         INT             UNSIGNED    PRIMARY KEY AUTO_INCREMENT
    ,Username       VARCHAR(25)     NOT NULL
    ,Password       VARCHAR(40)     NOT NULL
    ,Email          VARCHAR(25)
    ,IsVerified     BOOLEAN
    ,ProfilePhoto   VARCHAR(100)
    ,ShowNSFW       BOOLEAN         NOT NULL    DEFAULT 0
    ,Deleted        BOOLEAN         NOT NULL    DEFAULT 0
    ,Updated        TIMESTAMP       NOT NULL
    ,Created        TIMESTAMP       NOT NULL    DEFAULT CURRENT_TIMESTAMP
    ,LastLogin      TIMESTAMP

    ,CONSTRAINT     uc_Username     UNIQUE      (Username)
);

CREATE TABLE Photos
(
     PhotoID        INT             UNSIGNED    PRIMARY KEY AUTO_INCREMENT
    ,SubmitterID    INT             UNSIGNED    NOT NULL
    ,ImgUrl         VARCHAR(50)     NOT NULL
    ,LocalUrl       VARCHAR(255)
    ,Views          INT             NOT NULL    DEFAULT 0
    ,IsNSFW         BOOLEAN         NOT NULL    DEFAULT 0
    ,Deleted        BOOLEAN         NOT NULL    DEFAULT 0
    ,Updated        TIMESTAMP       NOT NULL
    ,Created        TIMESTAMP       NOT NULL    DEFAULT CURRENT_TIMESTAMP

    ,FOREIGN KEY (SubmitterID)      REFERENCES  Users(UserID)
);

CREATE TABLE Votes
(
     VoteID         INT             UNSIGNED    PRIMARY KEY AUTO_INCREMENT
    ,PhotoID        INT             UNSIGNED    NOT NULL
    ,VoterID        INT             UNSIGNED    NOT NULL
    ,Vote           INT             NOT NULL
    ,Score          INT
    ,SampleSize     INT
    ,Prediction     FLOAT
    ,Correct        BOOLEAN
    ,Updated        TIMESTAMP       NOT NULL
    ,Created        TIMESTAMP       NOT NULL    DEFAULT CURRENT_TIMESTAMP

    ,FOREIGN KEY    (PhotoID)       REFERENCES  Photos(PhotoID)
    ,FOREIGN KEY    (VoterID)       REFERENCES  Users(UserID)

    ,CONSTRAINT     uc_UserVotes    UNIQUE      (PhotoID, VoterID)
);

CREATE TABLE TagTypes
(
     TagTypeID          INT         UNSIGNED    PRIMARY KEY AUTO_INCREMENT
    ,TagName            VARCHAR(25) NOT NULL
    ,CannonicalTagID    INT         UNSIGNED
    ,Updated            TIMESTAMP   NOT NULL
    ,Created            TIMESTAMP   NOT NULL    DEFAULT CURRENT_TIMESTAMP

    ,FOREIGN KEY (CannonicalTagID) REFERENCES TagTypes(TagTypeID)
    ,CONSTRAINT uc_TagTypes UNIQUE (TagName)
);

CREATE TABLE Tags
(
     TagID          INT         UNSIGNED    PRIMARY KEY AUTO_INCREMENT
    ,TaggedBy       INT         UNSIGNED    NOT NULL
    ,PhotoID        INT         UNSIGNED    NOT NULL
    ,TagTypeID      INT         UNSIGNED    NOT NULL
    ,Deleted        BOOLEAN     NOT NULL    DEFAULT 0
    ,Updated        TIMESTAMP   NOT NULL
    ,Created        TIMESTAMP   NOT NULL    DEFAULT CURRENT_TIMESTAMP

    ,FOREIGN KEY    (TaggedBy)  REFERENCES  Users(UserID)
    ,FOREIGN KEY    (PhotoID)   REFERENCES  Photos(PhotoID)
    ,FOREIGN KEY    (TagTypeID) REFERENCES  TagTypes(TagTypeID)
    ,CONSTRAINT     uc_UserTag  UNIQUE      (TaggedBy, PhotoID, TagTypeID)
);