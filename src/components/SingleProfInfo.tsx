import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Chip, Collapse, Grid, IconButton, Skeleton } from '@mui/material';
import React, { useState } from 'react';

import type { RMPInterface } from '~data/fetchFromRmp';
import type { GenericFetchedData } from '~types/GenericFetchedData';

type Props = {
  rmp: GenericFetchedData<RMPInterface>;
};

function SingleProfInfo({ rmp }: Props) {
  const [showMore, setShowMore] = useState(false);

  if (typeof rmp === 'undefined' || rmp.state === 'error') {
    return null;
  }

  if (rmp.state === 'loading') {
    return (
      <Grid container spacing={2} className="p-4">
        <Grid item xs={6}>
          <Skeleton variant="rounded">
            <p className="text-xl font-bold">5.0</p>
          </Skeleton>
          <p>Professor rating</p>
        </Grid>
        <Grid item xs={6}>
          <Skeleton variant="rounded">
            <p className="text-xl font-bold">5.0</p>
          </Skeleton>
          <p>Difficulty</p>
        </Grid>
        <Grid item xs={6}>
          <Skeleton variant="rounded">
            <p className="text-xl font-bold">1,000</p>
          </Skeleton>
          <p>Ratings given</p>
        </Grid>
        <Grid item xs={6}>
          <Skeleton variant="rounded">
            <p className="text-xl font-bold">99%</p>
          </Skeleton>
          <p>Would take again</p>
        </Grid>
        <Grid item xs={12}>
          <Skeleton variant="rounded">
            <p>Visit Rate My Professors</p>
          </Skeleton>
        </Grid>
      </Grid>
    );
  }

  if (rmp.data.numRatings == 0) {
    return (
      <Grid container spacing={2} className="p-4">
        <Grid item xs={6}>
          <p className="text-xl font-bold">
            {rmp.data.numRatings.toLocaleString()}
          </p>
          <p>Ratings given</p>
        </Grid>
        <Grid item xs={12}>
          <a
            href={
              'https://www.ratemyprofessors.com/professor/' + rmp.data.legacyId
            }
            target="_blank"
            className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
            rel="noreferrer"
          >
            Visit Rate My Professors
          </a>
        </Grid>
      </Grid>
    );
  }

  const topTags = rmp.data.teacherRatingTags.sort(
    (a, b) => b.tagCount - a.tagCount,
  );
  const first5 = topTags.slice(0, 5);
  const next5 = topTags.slice(5, 10);

  return (
    <Grid container spacing={2} className="p-4">
      <Grid item xs={6}>
        <p className="text-xl font-bold">
          {rmp.data.avgRating > 0 ? rmp.data.avgRating : 'N/A'}
        </p>
        <p>Professor rating</p>
      </Grid>
      <Grid item xs={6}>
        <p className="text-xl font-bold">
          {rmp.data.avgDifficulty > 0 ? rmp.data.avgDifficulty : 'N/A'}
        </p>
        <p>Difficulty</p>
      </Grid>
      <Grid item xs={6}>
        <p className="text-xl font-bold">
          {rmp.data.numRatings.toLocaleString()}
        </p>
        <p>Ratings given</p>
      </Grid>
      <Grid item xs={6}>
        <p className="text-xl font-bold">
          {rmp.data.wouldTakeAgainPercent > 0
            ? rmp.data.wouldTakeAgainPercent.toFixed(0) + '%'
            : 'N/A'}
        </p>
        <p>Would take again</p>
      </Grid>

      {first5.length > 0 && (
        <Grid item xs={12}>
          <div className="flex gap-y-1 flex-wrap">
            {first5.map((tag, index) => (
              <Chip
                key={index}
                label={`${tag.tagName} (${tag.tagCount})`}
                variant="outlined"
                className="mr-1"
              />
            ))}
            {next5.length > 0 && (
              <>
                {next5.map((tag, index) => (
                  <Collapse key={index} in={showMore} orientation="horizontal">
                    <Chip
                      label={`${tag.tagName} (${tag.tagCount})`}
                      variant="outlined"
                      className="mr-1"
                    />
                  </Collapse>
                ))}
                <IconButton
                  size="small"
                  aria-label="show more"
                  onClick={() => setShowMore(!showMore)}
                >
                  <ExpandMoreIcon
                    className={
                      'transition ' + (showMore ? 'rotate-90' : '-rotate-90')
                    }
                  />
                </IconButton>
              </>
            )}
          </div>
        </Grid>
      )}

      <Grid item xs={12}>
        <a
          href={
            'https://www.ratemyprofessors.com/professor/' + rmp.data.legacyId
          }
          target="_blank"
          className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
          rel="noreferrer"
        >
          Visit Rate My Professors
        </a>
      </Grid>
    </Grid>
  );
}

export default SingleProfInfo;
