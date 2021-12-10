const express = require('express')
const { buildSchema } = require('graphql')
const { graphqlHTTP } = require('express-graphql')
const cors = require('cors')

const schema = buildSchema(`
    type Score {
        subject: String
        score: Int
    }

	# 定义一个 User 类型 
	# 该类型可以在后面 Query 查询语句中使用
	type User {
		name: String
		age: Int
        # 数组类型 存放简单类型
        hobbies: [String]

        # 表示该字段不能为 null
        # hobbies: [String]!

        # 表示该数组中的元素不能为空
        # 即不允许 ['1', null] 的情况，但是 [] 是可以的
        # hobbies: [String!]!

        # 数组类型 存放复杂类型
        scores: [Score]
	}

    type Article {
        title: String
        body: String
        # 如果有嵌套对象，需要加内部的对象的类型拎出来单独写
        author: User
    }

	# Query 严格来说是一种对象类型
	# Query 是所有查询的入口点
	# Query 必须要有且只有一个
	# 在 Query 外进行写查询语句，查询不到对应的东西
    type Query {
        # 默认情况下每个字段都是可以为 空 的
        # 即当 resolver 中不存在该字段、但定义了该字段的类型，此时进行查询时，该字段会返回 null  
        # foo: String
        # ! 表示非空
        foo: String!
        bar: Int 
        scalary: Float
        isGood: Boolean
        user: User
        article: Article
    }
`)

// resolver 提供返回字段的内容
const rootValue = {
    // foo () {
    //     return 'foo'
    // },
    bar () {
        return 123
    },
    scalary () {
        return 123.123
    },
    isGood () {
        return false
    },
    user () {
        return {
            name: '张安',
            age: 30,
            hobbies: ['大鱼吃小鱼', '1937', '光辉岁月'],
            scores: [
                {
                    subject: 'chinese',
                    score: 100
                },
                {
                    subject: 'english',
                    score: 120
                }
            ]
        }
    },
    article () {
        return {
            title: '123123',
            body: '123123123',
            author: {
                name: 'JackeyLove',
                age: 30
            }
        }
    }
}

const app = express()

app.use(cors())

// 案例 对下列数据进行增删改查
const articles = [
    { id: 1, code: 'cc', title: '楚辞', body: '这里是楚辞' },
    { id: 2, title: '诗经', body: '这里是诗经' },
    { id: 3, title: '国风', body: '这里是国风' }
]

const articlesSchema = buildSchema(`
    type Article {
        id: ID!
        title: String!
        body: String!
        code: String
        tagList: [String!]
    }

    # 查询的入口
    type Query {
        articles: [Article]
        # 根据 id 查询数据
        # 对应的查询语句，查询语句前不加任何类型，默认就是 query 查询，也可以显示使用
        # 后面可以加一个名称，也可以不加，名字随便起，最好语义化
        # qeury getArticleById {
        #    article(id: 2, code: 'cc'): {
        #        id
        #        title
        #        body
        #    }
        # }
        # 可以传入多个参数
        article(id: ID!, code: String): Article
    }

    # 使用 input 关键字来定义参数类型
    input CreateArticleInput {
        title: String!
        body: String!
        code: String
    }
    input EditArticleInput {
        id: ID!
        title: String
        body: String
        code: String
        tagList: [String!]
    }

    type deletionStatus {
        success: Boolean!
    }

    # 增加 修改 删除 的入口
    # 对应的修改语句必须显示添加操作类型，然后后面可以加一个名称，也可以不加，名字随便起，最好语义化
    # mutation createArt {
    #    createArticle(title: "黍离", body: "这里是黍离", code: "sl") {
    #        id
    #    }
    # }
    # 当使用了 input 定义参数类型之后，修改语句的入参需要修改
    # mutation createArt {
    #    createArticle(article: {title: "黍离", body: "这里是黍离", code: "sl"}) {
    #        id
    #    }
    # }
    type Mutation {
        createArticle(article: CreateArticleInput): Article
        ediitArticleById(article: EditArticleInput): Article
        deleteArticle(id: ID!): deletionStatus
    }
`)

const articlesRootValue = {
    articles () {
        return articles
    },
    // 当上面查询语句进来时，args 为 { id: 2, code: 'cc' }
    article (args) {
        const { id } = args
        return articles.find(art => art.id === +id)
    },
    createArticle (args) {
        // const { title, body, code } = args
        // const article = {
        //     title, body, code,
        //     id: articles.length
        // }
        const { article } = args
        const newArticle = {
            ...article,
            id: articles.length + 1
        }
        articles.push(newArticle)
        return newArticle
    },
    ediitArticleById (args) {
        const { article } = args
        const index = articles.findIndex(item => item.id === +article.id)
        if (!(index + 1)) {
            return null
        }
        const oldArt = articles[index]
        const newArt = {
            ...oldArt,
            ...article
        }
        articles.splice(index, 1, newArt)
        return newArt
    },
    deleteArticle (args) {
        const { id } = args
        const index = articles.findIndex(item => item.id === +id)
        if (!(index + 1)) {
            return { success: false}
        }
        articles.splice(index, 1)
        return { success: true }
    }
}

app.use('/articles', graphqlHTTP({
    schema: articlesSchema,
    rootValue: articlesRootValue,
    graphiql: true
}))

app.use('/graphql', graphqlHTTP({
    schema,
    rootValue,
    // 开启浏览器 graphql ide 调试工具
    graphiql: true
}))

app.listen(4444, () => {
    console.log('start')
})