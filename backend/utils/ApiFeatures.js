class ApiFeatures{
    constructor(query,queryStr){
        this.query= query;
        this.queryStr= queryStr;
    }

    search(){
        const keyword=this.queryStr.keyword?{
            name:{
                $regex:this.queryStr.keyword,
                $options:'i'
            }
        }:{}

        this.query=this.query.find({...keyword});

        return this;
    }

    filter(){
        const filterKey={...this.queryStr};
        let removeKey=['keyword','limit','page']
        removeKey.forEach(el=>delete filterKey[el])

        let queryStr=JSON.stringify(filterKey);

        queryStr=queryStr.replace(/\b(gt|gte|lt|lte)\b/g,match=>"$"+match)
        

        this.query=this.query.find(JSON.parse(queryStr));

        return this;

    }

    resPerPage(resPerPage){
        const currentPage=Number(this.queryStr.page)||1;
        const skip=resPerPage*(currentPage-1);

        this.query=this.query.limit(resPerPage).skip(skip);

        return this;
    }
}

module.exports=ApiFeatures;