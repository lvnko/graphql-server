## 專案啟動步驟
1. 安裝依賴模組
```node
npm install
```
2. 啟動環境
```node
npm run dev
```

## GraphQL 學習資源
- GraphQL 的概念介紹與使用方法 :
    [GraphQL 入門看這篇就夠了](https://www.freecodecamp.org/chinese/news/a-detailed-guide-to-graphql/)
    - 操作類型 Operation Type
        1. Query 查詢：獲取數據庫資料，例如查找，CRUD 中的 R
        2. Mutation 變更：對數據庫進行變更，比如增加、刪除、修改，CRUD 中的 CUD
        3. Subscription 訂閱：當數據發生變更，便推送最新消息
        以下例子為一個簡單的查詢 (Query)
        ```sdl
        query {
            user { id }
        }
        ```
    - 物件類型和標準類型 Object Type & Scalar Type
- Fragment 的使用場景、概念及實例 :
    [Handbook for using fragments in GraphQL](https://developer.ibm.com/articles/awb-handbook-for-using-fragments-in-graphql/)  
    在 IBM 官網上的技術文章，其中談及 framgment、interface、alias 與 union 的實例。
## 其他有用資源
- [AST Explorernpm](https://astexplorer.net/)
- Reading : [GraphQLSchema vs. buildSchema vs. makeExecutableSchema](https://stackoverflow.com/questions/53984094/notable-differences-between-buildschema-and-graphqlschema)
- Example : [buildSchema with SDL while defining resolver separately](https://github.com/IvanGoncharov/swapi-demo/blob/master/src/index.ts)
