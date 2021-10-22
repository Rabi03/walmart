/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect,useState } from 'react'
import MetaData from './layout/MetaData'
import Pagination from 'react-js-pagination'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css';

import {useDispatch, useSelector} from 'react-redux'
import { getProducts } from '../actions/ProductActions'
import Product from './product/Product'
import Loader from './layout/Loader'
import {useAlert} from 'react-alert'

const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range)

export default function Home({match}) {
    const [currentPage, setCurrentPage] = useState(1)
    const [price, setPrice] = useState([1, 25000])
    const alert=useAlert()
    const dispatch = useDispatch()

    const [category, setCategory] = useState('')
    const [rating, setRating] = useState(0)

    const categories = [
        'Electronics',
        'Cameras',
        'Laptops',
        'Accessories',
        'Headphones',
        'Food',
        "Books",
        'Clothes/Shoes',
        'Beauty/Health',
        'Sports',
        'Outdoor',
        'Home'
    ]

    const keyword=match.params.keyword

    const {loading,products,error,resPerPage,productCount,filteredProductsCount}=useSelector(state => state.products)

    useEffect(() => {
        if(error){
            return alert.error(error.message)
        }
        dispatch(getProducts(keyword,currentPage,price,category,rating))
        
    },[dispatch,alert,error,keyword,currentPage,price,category,rating])

    const  setCurrentPageNo=(pageNumber)=> {
        setCurrentPage(pageNumber)
    }

    let count=productCount
    if(keyword){
        count=filteredProductsCount
    }

    return (
        <>
        {loading?<>
            <Loader />
        </>:
            <>
               <MetaData title={keyword?keyword:"Buy Best Product Online"} />
            <h1 id="products_heading">Latest Products</h1>

            <section id="products" className="container mt-5">
            <div className="row">

            {
                keyword?<>
                    <div className="col-6 col-md-3 mt-5 mb-5">
                        <div className="px-5">
                            <Range
                                marks={{
                                    1: `$1`,
                                    25000: `$25000`
                                }}
                                min={1}
                                max={25000}
                                defaultValue={[1, 25000]}
                                tipFormatter={value => `$${value}`}
                                tipProps={{
                                    placement: "top",
                                    visible: true
                                }}
                                value={price}
                                onChange={price => setPrice(price)}
                            />

                            <hr className="my-5" />

                            <div className="mt-5">
                                <h4 className="mb-3">
                                    Categories
                                </h4>

                                <ul className="pl-0">
                                    {categories.map(category => (
                                        <li
                                            style={{
                                                cursor: 'pointer',
                                                listStyleType: 'none'
                                            }}
                                            key={category}
                                            onClick={() => setCategory(category)}
                                        >
                                            {category}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <hr className="my-3" />

                                <div className="mt-5">
                                    <h4 className="mb-3">
                                        Ratings
                                    </h4>

                                    <ul className="pl-0">
                                        {[5, 4, 3, 2, 1].map(star => (
                                            <li
                                                style={{
                                                    cursor: 'pointer',
                                                    listStyleType: 'none'
                                                }}
                                                key={star}
                                                onClick={() => setRating(star)}
                                            >
                                                <div className="rating-outer">
                                                    <div className="rating-inner"
                                                        style={{
                                                            width: `${star * 20}%`
                                                        }}
                                                    >
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                            </div>
                    </div>

                    <div className="col-6 col-md-9">
                        <div className="row">
                            {products.length>0&&products.map(product => (
                                <Product key={product._id} product={product} col={4} />
                            ))}
                        </div>
                    </div>
                </>
                
                :
                products.length>0&&products.map(product =>(
                <Product key={product._id} product={product} col={3} />
            ))}
                
            </div>
            </section> 
            {resPerPage<=count&&(
                <div className="d-flex justify-content-center mt-5">
                <Pagination
                    activePage={currentPage}
                    itemsCountPerPage={resPerPage}
                    totalItemsCount={productCount}
                    onChange={setCurrentPageNo}
                    nextPageText={'Next'}
                    prevPageText={'Prev'}
                    firstPageText={'First'}
                    lastPageText={'Last'}
                    itemClass="page-item"
                    linkClass="page-link"
                />
            </div>
            )}
            

            </>
        }
            
        </>
    )
}
