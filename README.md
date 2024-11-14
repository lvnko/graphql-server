# Week #007 + Week #008
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
    [GraphQL 入門看這篇就夠了](https://www.freecodecamp.org/chinese/news/a-detailed-guide-to-graphql/), [介紹 GraphQL 的 Schema,type,field](https://ithelp.ithome.com.tw/articles/10285159)
    - 操作類型 Operation Type
        1. **Query** 查詢：獲取數據庫資料，例如查找，CRUD 中的 R
        2. **Mutation** 變更：對數據庫進行變更，比如增加、刪除、修改，CRUD 中的 CUD
        3. **Subscription** 訂閱：當數據發生變更，便推送最新消息
        ***
        以下例子為一個簡單的查詢 (Query)  
        ```sdl
        query {
            user { id }
        }
        ```
    - 物件類型和標準類型 Object Type & Scalar Type
        1. **Object Type** : 用戶可在 schema 中自定義的 type，透過加入不同的 field (欄位) 來封裝成獨立的資料型別，用以配合不同的操作 (e.g. Query 或 Mutation)
        2. **Scalar Type** : GraphQL 中內置的標準型別 (String、Int、Float、Boolean、ID)，通常用來定義 Object Type 裡的 field 的型別，搭配尾端的 ! 以代表該欄位不能為 Null；此外用戶也可以自我定義內建以外的 Custom Scalar Type，詳細用法可參考進階閱讀。
        ***
        以下例子演示如何在 Schema 中定義 ``User`` 著個 Object Type，其中 ``name`` 的欄位型別為 ``String`` 字串且不能為空白  
        ```sdl
        type User {
            name: String!
            age: Int
        }
        ```
- 進階閱讀：
    - Fragment 的使用場景、概念及實例 :
        [Handbook for using fragments in GraphQL](https://developer.ibm.com/articles/awb-handbook-for-using-fragments-in-graphql/)  
        在 IBM 官網上的技術文章，其中談及 framgment、interface、alias 與 union 的實例。
    - 建立 Date Scalar Type 及其 Resolvers 實作 :
        [實作 Custom Scalar Type (Date Scalar Type)](https://ithelp.ithome.com.tw/articles/10206366)
## 其他有用資源
- GraphQL
    - [AST Explorer](https://astexplorer.net/)
    - Reading : [GraphQLSchema vs. buildSchema vs. makeExecutableSchema](https://stackoverflow.com/questions/53984094/notable-differences-between-buildschema-and-graphqlschema)
    - Example : [buildSchema with SDL while defining resolver separately](https://github.com/IvanGoncharov/swapi-demo/blob/master/src/index.ts)
    - 官方教程 : [GraphQL tutorials and resources](https://www.apollographql.com/tutorials/browse/)
    - 官方使用手冊 : [Introduction to GraphQL...](https://graphql.org/learn/)
- MongoDB [[官網](https://www.mongodb.com/)]
    - 使用手冊 (8.0 current) [What is MongoDB?](https://www.mongodb.com/docs/manual/)
