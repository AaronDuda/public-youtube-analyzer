import 'dotenv/config';
import express, { json } from 'express';
import { driver as neo4jDriver, auth } from 'neo4j-driver';

const WHERE_VIDEO_MAX_LENGTH = 'v.length <= $hlength';
const WHERE_VIDEO_MIN_LENGTH = 'v.length >= $llength';
const WHERE_VIDEO_MAX_RATE = 'v.rate <= $hrate';
const WHERE_VIDEO_MIN_RATE = 'v.rate >= $lrate';
const WHERE_VIDEO_MAX_RATINGS = 'v.ratings <= $hratings';
const WHERE_VIDEO_MIN_RATINGS = 'v.ratings >= $lratings';
const WHERE_VIDEO_MAX_COMMENTS = 'v.comments <= $comments';
const WHERE_VIDEO_MIN_COMMENTS = 'v.comments >= $comments';
const WHERE_CATEGORIES = 'c.category IN $categories';
const WHERE_VIDEO_MIN_AGE = 'v.age >= $lage';
const WHERE_VIDEO_MAX_AGE = 'v.age <= $hage';
const WHERE_VIDEO_MIN_VIEWS = 'v.views >= $lviews';
const WHERE_VIDEO_MAX_VIEWS = 'v.views <= $hviews';

const WHERE_VIDEO2_MAX_LENGTH = 't.length <= $hlength';
const WHERE_VIDEO2_MIN_LENGTH = 't.length >= $llength';
const WHERE_VIDEO2_MAX_RATE = 't.rate <= $hrate';
const WHERE_VIDEO2_MIN_RATE = 't.rate >= $lrate';
const WHERE_VIDEO2_MAX_RATINGS = 't.ratings <= $hratings';
const WHERE_VIDEO2_MIN_RATINGS = 't.ratings >= $lratings';
const WHERE_VIDEO2_MAX_COMMENTS = 't.comments <= $comments';
const WHERE_VIDEO2_MIN_COMMENTS = 't.comments >= $comments';
const WHERE_VIDEO2_MIN_AGE = 't.age >= $lage';
const WHERE_VIDEO2_MAX_AGE = 't.age <= $hage';
const WHERE_VIDEO2_MIN_VIEWS = 't.views >= $lviews';
const WHERE_VIDEO2_MAX_VIEWS = 't.views <= $hviews';
const WHERE = ' WHERE '
const AND = ' AND '

const MATCH_UNIQUE_VIDEO = '(v:Video {id: $id})';
const MATCH_NO_DESC_VIDEO = '(v)'
const MATCH_UNIQUE_UPLOADER = '(u:Uploader {uploader: $uploader})';
const MATCH_VIDEO = '(v:Video)';
const MATCH_VIDEO2 = '(t:Video)';
const MATCH_UPLOADER = '(u:Uploader)';
const MATCH_CATEGORY = '(c:Category)';
const MATCH_UPLOADED_BY = '-[ub:UPLOADED_BY]->';
const MATCH_RELATED_TO = '-[r:RELATED_TO]->';
const MATCH_VIDEO_TYPE = '-[vt:VIDEO_TYPE]->';
const COMMA = ', ';
const MATCH = 'MATCH ';

const RESULT_PARAMS = {
    v: "video",
    t: "related_video",
    c: "category",
    u: "uploader",
    ub: "uploaded_by",
    r: "related_to",
    vt: "video_type" 
}

const RESULT_COUNTS = {
    'size(c) as category_count': 'category_count',
    'size(u) as uploader_count': 'uploader_count',
    'size(v) as video_count': 'video_count', 
    'size(t) as related_video_count': 'related_video_count'
}

function buildMatch(req) {
    let match = '';
    let returnParameters = [];
    let counts = []
    let collections = []
    if (req.query.excludeV && req.query.excludeU && req.query.excludeC) {
        return {
            match: '',
            returnParameters: [],
            counts: [],
            collections: []
        };
    } else if (req.query.excludeV && req.query.excludeU && req.query.categories) {
        match = MATCH + MATCH_CATEGORY;
        returnParameters = ['c'];
        counts = ['size(c) as category_count'];
        collections = ['collect(distinct c) as c'];
    } else if (req.query.excludeV &&  req.query.excludeC) {
        match = MATCH + (req.query.uploader ? MATCH_UNIQUE_UPLOADER : MATCH_UPLOADER);
        returnParameters = ['u'];
        counts = ['size(u) as uploader_count'];
        collections = ['collect(distinct u) as u'];
    } else if (req.query.excludeC && req.query.excludeU) {
        const VIDEO = req.query.id ? MATCH_UNIQUE_VIDEO : MATCH_VIDEO;
        match = MATCH + VIDEO + MATCH_RELATED_TO + MATCH_VIDEO2;
        returnParameters = ['v', 'r', 't'];
        counts = ['size(v) as video_count', 'size(t) as related_video_count'];
        collections = ['collect(distinct v) as v', 'collect(distinct t) as t', 'collect(distinct r) as r'];
    } else if (req.query.excludeV) {
        match = MATCH + (req.query.uploader ? MATCH_UNIQUE_UPLOADER : MATCH_UPLOADER) + COMMA + MATCH_CATEGORY;
        returnParameters = ['c', 'u'];
        counts = ['size(c) as category_count', 'size(u) as uploader_count'];
        collections = ['collect(distinct c) as c', 'collect(distinct u) as u'];
    } else if (req.query.excludeC) {
        const VIDEO = req.query.id ? MATCH_UNIQUE_VIDEO : MATCH_VIDEO;
        match = MATCH + VIDEO + MATCH_UPLOADED_BY + (req.query.uploader ? MATCH_UNIQUE_UPLOADER : MATCH_UPLOADER) + COMMA + MATCH_NO_DESC_VIDEO + MATCH_RELATED_TO + MATCH_VIDEO2;
        returnParameters = ['v', 'r', 't', 'u', 'ub'];
        counts = ['size(u) as uploader_count', 'size(v) as video_count', 'size(t) as related_video_count'];
        collections = ['collect(distinct u) as u', 'collect(distinct v) as v', 'collect(distinct t) as t', 'collect(distinct r) as r', 'collect(distinct ub) as ub'];
    } else if (req.query.excludeU) {
        const VIDEO = req.query.id ? MATCH_UNIQUE_VIDEO : MATCH_VIDEO;
        match = MATCH + VIDEO + MATCH_VIDEO_TYPE + MATCH_CATEGORY + COMMA + MATCH_NO_DESC_VIDEO + MATCH_RELATED_TO + MATCH_VIDEO2;
        returnParameters = ['v', 'r', 't', 'c', 'vt'];
        counts = ['size(c) as category_count', 'size(v) as video_count', 'size(t) as related_video_count'];
        collections = ['collect(distinct c) as c', 'collect(distinct v) as v', 'collect(distinct t) as t', 'collect(distinct r) as r', 'collect(distinct vt) as vt'];
    } else {
        const VIDEO = req.query.id ? MATCH_UNIQUE_VIDEO : MATCH_VIDEO;
        match = MATCH + VIDEO + MATCH_VIDEO_TYPE + MATCH_CATEGORY + COMMA + MATCH_NO_DESC_VIDEO + MATCH_UPLOADED_BY + (req.query.uploader ? MATCH_UNIQUE_UPLOADER : MATCH_UPLOADER) + COMMA + MATCH_NO_DESC_VIDEO + MATCH_RELATED_TO + MATCH_VIDEO2;
        returnParameters = ['v', 'r', 't', 'u', 'ub', 'c', 'vt'];
        counts = ['size(c) as category_count', 'size(u) as uploader_count', 'size(v) as video_count', 'size(t) as related_video_count'];
        collections = ['collect(distinct c) as c', 'collect(distinct u) as u', 'collect(distinct v) as v', 'collect(distinct t) as t', 'collect(distinct r) as r', 'collect(distinct ub) as ub', 'collect(distinct vt) as vt'];
    }

    return {
        match: match,
        returnParameters: returnParameters,
        counts: counts,
        collections: collections
    };
}

function buildWhere(req) {
    let where = WHERE;
    let and = false;
    let params = {}
    if (req.query.lLength) {
        where += WHERE_VIDEO2_MIN_LENGTH + AND + WHERE_VIDEO_MIN_LENGTH;
        params.llength = parseInt(req.query.lLength);
        and = true;
    } if (req.query.hLength) {
        where += (and ? AND : '') + WHERE_VIDEO2_MAX_LENGTH + AND + WHERE_VIDEO_MAX_LENGTH;
        and = true;
        params.hlength = parseInt(req.query.hLength);
    } if (req.query.lViews) {
        where += (and ? AND : '') + WHERE_VIDEO2_MIN_VIEWS + AND + WHERE_VIDEO_MIN_VIEWS;
        and = true;
        params.lviews = parseInt(req.query.lViews);
    } if (req.query.hViews) {
        where += (and ? AND : '') + WHERE_VIDEO2_MAX_VIEWS + AND + WHERE_VIDEO_MAX_VIEWS;
        and = true;
        params.hviews = parseInt(req.query.hViews);
    } if (req.query.lrate) {
        where += (and ? AND : '') + WHERE_VIDEO2_MIN_RATE + AND + WHERE_VIDEO_MIN_RATE;
        and = true;
        params.lrate = parseFloat(req.query.lrate);
    } if (req.query.hrate) {
        where += (and ? AND : '') + WHERE_VIDEO2_MAX_RATE + AND + WHERE_VIDEO_MAX_RATE;
        and = true;
        params.hrate = parseFloat(req.query.hrate);
    } if (req.query.lRatings) {
        where += (and ? AND : '') + WHERE_VIDEO2_MIN_RATINGS + AND + WHERE_VIDEO_MIN_RATINGS;
        and = true;
        params.lratings = parseInt(req.query.lRatings);
    } if (req.query.hRatings) {
        where += (and ? AND : '') + WHERE_VIDEO2_MAX_RATINGS + AND + WHERE_VIDEO_MAX_RATINGS;
        and = true;
        params.hratings = parseInt(req.query.hRatings);
    } if (req.query.lComments) {
        where += (and ? AND : '') + WHERE_VIDEO2_MIN_COMMENTS + AND + WHERE_VIDEO_MIN_COMMENTS;
        and = true;
        params.lcomments = parseInt(req.query.lComments);
    } if (req.query.hComments) {
        where += (and ? AND : '') + WHERE_VIDEO2_MAX_COMMENTS + AND + WHERE_VIDEO_MAX_COMMENTS;
        and = true;
        params.hcomments = parseInt(req.query.hComments);
    } if (req.query.startDate) {
        where += (and ? AND : '') + WHERE_VIDEO2_MIN_AGE + AND + WHERE_VIDEO_MIN_AGE;
        and = true;
        params.lage = parseInt(req.query.startDate);
    } if (req.query.endDate) {
        where += (and ? AND : '') + WHERE_VIDEO2_MAX_AGE + AND + WHERE_VIDEO_MAX_AGE;
        and = true;
        params.hage = parseInt(req.query.endDate);

    } if (req.query.categories) {
        where += (and ? AND : '') + WHERE_CATEGORIES;
        and = true;
    }

    return {
        params: params,
        where: where == WHERE ? '' : where
    }
}

const app = express();
app.use(json());

const driver = neo4jDriver(
    process.env.NEO4J_URI,
    auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);
const session = driver.session();

app.get('/test', async (req, res) => res.status(200).json({ message: "Server was successfully accessed"}));

app.get('/search', async (req, res) => {
    const {match, returnParameters, counts, collections} = buildMatch(req);

    if (match == '' || !returnParameters.length || !counts.length || !collections.length) {
        res.status(404).json({ error: 'Query Empty' });
        return;
    }

    let returnLine1 = ' RETURN distinct ' + returnParameters.join(COMMA);
    let returnLine2 = ' RETURN ' + returnParameters.join(COMMA) + COMMA + counts.join(COMMA);
    let withClause = ' WITH ' + collections.join(COMMA); 

    if (req.query.limit) {
        returnLine1 += ' LIMIT ' + req.query.limit;
    } else {
        returnLine1 += ' LIMIT ' + 10;
    }

    const {params, where} = buildWhere(req); 
    let query = 'CALL {' + match + where + returnLine1 + '}' + withClause + returnLine2;
    console.log(query);
    try {
        const result = await session.run(query, params);
        let graph = {
            data: {
                video: undefined,
                related_video: undefined,
                category: undefined,
                uploader: undefined,
                uploaded_by: undefined,
                related_to: undefined,
                video_type: undefined,
            },
            statistics: {
                video_count: 0,
                related_video_count: 0,
                category_count: 0,
                uploader_count: 0,
                total_nodes: 0
            }
        }
        returnParameters.forEach((return_param) => {
            if (RESULT_PARAMS[return_param]) {
                let graph_datum = RESULT_PARAMS[return_param];
                graph.data[graph_datum] = result.records.map(record => record.get(return_param));
            }
        });

        counts.forEach((count) => {
            if(RESULT_COUNTS[count]) {
                let param_name = RESULT_COUNTS[count];
                graph.statistics[param_name] = result.records[0].get(param_name).toNumber();
            }
        })

        graph.statistics.total_nodes = graph.statistics.video_count + graph.statistics.related_video_count + graph.statistics.category_count + graph.statistics.uploader_count;
        res.json(graph);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

