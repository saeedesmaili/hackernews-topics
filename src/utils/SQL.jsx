import initSqlJs from "sql.js";

const WASMConfig = {
  locateFile: (filename) => `../src/assets/${filename}`,
};

async function yearlyDataFromURL() {
  const sqlPromise = initSqlJs(WASMConfig);
  const dbUrl =
    "https://raw.githubusercontent.com/saeedesmaili/hackernews-topics/master/src/data/my_database.db";
  const dataPromise = fetch(dbUrl).then((res) => res.arrayBuffer());
  const [SQL, buf] = await Promise.all([sqlPromise, dataPromise]);
  const db = new SQL.Database(new Uint8Array(buf));

  const query = `
    WITH unigrams AS (
      SELECT 
          SUBSTR(month, 1, 4) as year, 
          month,
          unigram, 
          MIN(unigram_score) as min_unigram_score
      FROM 
          ngrams 
      GROUP BY 
          month, unigram
  ),
  
    rankedTable AS (
        SELECT
            year,
            unigram,
            SUM(min_unigram_score) as sum_unigram_score,
            ROW_NUMBER() OVER (PARTITION BY year ORDER BY SUM(min_unigram_score) DESC) as rn
        FROM 
          unigrams
        GROUP BY 
            year, unigram
    )
  
    SELECT 
        year,
        unigram,
        rn
    FROM 
        rankedTable
    WHERE 
        rn <= 50;
  `;

  const queryResult = db.exec(query)[0].values;
  const resultMap = {};

  const startYear = 2007;
  const endYear = 2022;
  const yearRange = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  );

  queryResult.forEach(([year, unigram, rn], index) => {
    if (!resultMap[unigram]) {
      resultMap[unigram] = {
        id: unigram,
        data: yearRange.map((y) => ({ x: `${y}`, y: null })),
      };
    }
    const yearData = resultMap[unigram].data.find((d) => d.x === year);
    if (yearData) yearData.y = rn;
  });

  const finalResult = Object.values(resultMap);

  return finalResult;
}

async function monthlyDataFromURL({ year }) {
  const sqlPromise = initSqlJs(WASMConfig);
  const dbUrl =
    "https://raw.githubusercontent.com/saeedesmaili/hackernews-topics/master/src/data/my_database.db";
  const dataPromise = fetch(dbUrl).then((res) => res.arrayBuffer());
  const [SQL, buf] = await Promise.all([sqlPromise, dataPromise]);
  const db = new SQL.Database(new Uint8Array(buf));

  const query = `
    WITH unigrams AS (
      SELECT 
          CAST(SUBSTR(month, 6, 7) as INTEGER) as month_num, 
          month,
          unigram, 
          MIN(unigram_score) as min_unigram_score
      FROM 
          ngrams 
      WHERE
          SUBSTR(month, 1, 4) = '${year}'
      GROUP BY 
          month, unigram
  ),
  
    rankedTable AS (
        SELECT
            month,
            unigram,
            SUM(min_unigram_score) as sum_unigram_score,
            ROW_NUMBER() OVER (PARTITION BY month ORDER BY SUM(min_unigram_score) DESC) as rn
        FROM 
          unigrams
        GROUP BY 
            month, unigram
    )
  
    SELECT 
        month,
        unigram,
        rn
    FROM 
        rankedTable
    WHERE 
        rn <= 50;
  `;

  const queryResult = db.exec(query)[0].values;
  const resultMap = {};

  const startMonth = 1;
  const endMonth = 12;
  const monthRange = Array.from(
    { length: endMonth - startMonth + 1 },
    (_, i) => `${year}-${(startMonth + i).toString().padStart(2, "0")}`
  );

  queryResult.forEach(([month, unigram, rn], index) => {
    if (!resultMap[unigram]) {
      resultMap[unigram] = {
        id: unigram,
        data: monthRange.map((y) => ({ x: `${y}`, y: null })),
      };
    }
    const monthData = resultMap[unigram].data.find((d) => d.x === month);
    if (monthData) monthData.y = rn;
  });

  const finalResult = Object.values(resultMap);

  return finalResult;
}

export { yearlyDataFromURL, monthlyDataFromURL };
