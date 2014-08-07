USE swippl;

-- Method:
--  1. Calculate predictions for user
--  2. Compare predictions to actual votes (Correct)
--     (Number correct) / (Total) = (Accuracy)

SET @UserID = 15;

SELECT
     SUM(Correct) AS Correct
    ,COUNT(Correct) AS Total
    ,SUM(Correct) / COUNT(Correct) AS Accuracy
FROM (
    SELECT
         *
        ,CASE
            WHEN PredictedVote IS NULL          THEN 0
            WHEN UserVote = 0                   THEN 0
            WHEN UserVote * PredictedVote > 0   THEN 1
            ELSE                                     -1
         END AS Correct
    FROM (
        SELECT
             Unseen.*
            ,SUM(Votes.Vote) AS Score
            ,COUNT(Vote) AS SampleSize
            ,SUM(Rec.Alike * Vote) AS ProbableVote
            ,SUM(Rec.Alike * Vote) * COUNT(Vote) AS PredictedVote
        FROM (
               SELECT Photos.*, Votes.Vote AS UserVote
                 FROM Photos
            LEFT JOIN Votes
                   ON Votes.PhotoID = Photos.PhotoID
                  AND VoterID = @UserID
                WHERE VoterID IS NOT NULL
                  AND Photos.IsNSFW <= (SELECT ShowNSFW FROM Users WHERE UserID = @UserID)
        ) AS Unseen

        LEFT JOIN Votes
        ON Unseen.PhotoID = Votes.PhotoID

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
                 WHERE A.PhotoID = B.PhotoID
                   AND A.VoterID <> B.VoterID
                   AND A.VoterID = @UserID
            GROUP BY A.VoterID, B.VoterID
            HAVING Alike <> 0
            ORDER BY A.VoterID, Alike DESC
        ) AS Rec
        
    ON Rec.VoterB = Votes.VoterID
    GROUP BY Unseen.PhotoID
    ORDER BY PredictedVote DESC, Score DESC
    ) AS Accuracy
    
) AS TotalAccuracy