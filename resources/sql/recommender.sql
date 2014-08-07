USE swippl;

-- Using:
--  1. Unseen photos
--  2. Recommended users (with overlap)
--
--        [(number of votes in common with user x)
--      - (number of votes different from user x)]
--      / (total votes)
--      = (percentage overlap with user x)

-- Method:
--  1. Calculate estimate of user's preference for each photo based on each user who voted for that photo
--
--      (Overlap percentage of current user with user x)
--       * (user x's vote on a particular photo)
--       = (weighted estimate of current user's preference)
--
--  2. Sum all estimates to get final prediction
--  3. Rank by prediction, limit to (prediction is positive and estimates > 4)
--     OR (number of estimates < 5)

SET @UserID = (SELECT UserID FROM Users WHERE Username = 'hootenanny');

SELECT
    Unseen.*
    ,SUM(Votes.Vote) AS Score
    ,COUNT(Vote) AS SampleSize
    ,SUM(Rec.Alike * Vote) AS Prediction
    ,SUM(Rec.Alike * Vote) * COUNT(Vote) AS ScaledPrediction
--  1. Unseen photos
FROM (
    SELECT Photos.*
    FROM Photos
    LEFT JOIN Votes
           ON Votes.PhotoID = Photos.PhotoID
          AND VoterID = @UserID
        WHERE VoterID IS NULL
          AND Photos.IsNSFW <= (SELECT ShowNSFW FROM Users WHERE UserID = @UserID)
) AS Unseen

LEFT JOIN Votes
       ON Unseen.PhotoID = Votes.PhotoID

--  2. Recommended users
LEFT JOIN (
    SELECT
         A.VoterID AS VoterA
        ,B.VoterID AS VoterB
        ,SUM(
            CASE
                WHEN A.Vote = 0 OR B.Vote = 0   THEN 0
                WHEN A.Vote = B.Vote            THEN 1
                ELSE -1
            END
        ) / COUNT(A.Vote) AS Alike
    FROM Votes AS A
    CROSS JOIN Votes AS B
         WHERE A.PhotoID =  B.PhotoID
           AND A.VoterID <> B.VoterID
           AND A.VoterID =  @UserID
    GROUP BY A.VoterID, B.VoterID
    HAVING Alike <> 0
    ORDER BY A.VoterID, Alike DESC
) AS Rec
ON Rec.VoterB = Votes.VoterID

GROUP BY PhotoID
HAVING Prediction IS NULL
	OR SampleSize < 5
	OR (SampleSize > 4 AND Prediction > 0)
ORDER BY ScaledPrediction DESC, Score DESC
LIMIT 5