import { Row, Col, Rate, Divider} from 'antd';
import './book.scss';
import ImageGallery from 'react-image-gallery';
import { useEffect, useRef, useState } from 'react';
import ModalGallery from './ModalGallery';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { BsCartPlus } from 'react-icons/bs';
import BookLoader from './BookLoader';
import { useLocation, useNavigate } from 'react-router-dom';
import { callFetchBookById } from '../../services/api-crud-book';
import { useDispatch } from 'react-redux';
import { doAddBookAction } from '../../redux/order/orderSlice';

const ViewDetail = (props) => {

    const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const location = useLocation()
    const dispatch = useDispatch()
    const [currentQuantity, setCurrentQuantity] = useState(1);
    const navigate = useNavigate();
    const refGallery = useRef(null);
    const [dataBook, setDataBook] = useState([]);

    let params = new URLSearchParams(location.search);
    const id = params?.get('id');

  
    
   

    useEffect(() => {
      fetchBook(id);
    }, [id])

    const fetchBook = async (id) => {
      const res = await callFetchBookById(id);
      if(res && res.data){
        let raw = res.data;
        raw.items = getImages(raw)
        setDataBook(raw);
      }
    }

    const getImages = (raw) => {
      const images = []
      if (raw.thumbnail) {
       
        images.push({
          original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${raw.thumbnail}`,
          thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${raw.thumbnail}`,
          originalClass: 'original-image',
          thumbnailClass: 'thumbnail-image',
        });
      }

      if (raw.slider) {
        
        raw.slider?.map(item=>{
          images.push({
            original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
            thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
            originalClass: 'original-image',
            thumbnailClass: 'thumbnail-image',
          });
        })
      }
      return images
    }

    const handleOnClickImage = () => {
        //get current index onClick
        // alert(refGallery?.current?.getCurrentIndex());
        setIsOpenModalGallery(true);
        setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0)
        // refGallery?.current?.fullScreen()
    }

    const handleAddToCart = (quantity,book) => {
      dispatch(doAddBookAction({quantity,detail: book, _id:book._id}))
    }

    const handleChangeButton = (type) => {
      if(type === 'MINUS'){
        if(currentQuantity - 1 <= 0) return //quantity <= 0
        setCurrentQuantity(currentQuantity - 1)
      }
      if(type === 'PLUS'){
        if(currentQuantity === +dataBook.quantity) return //max quantity
        setCurrentQuantity(currentQuantity + 1)
      }
    }

    // const handleChangeButtonAtd = (value) => {
    //   console.log(value)
    //   setCurrentQuantity(value)
    // }

    const handleChangeInput = (value) => {
      if(!isNaN(value)){
        if(+value > 0 && +value < +dataBook.quantity){
          setCurrentIndex(+value)
        }
      }
    }

    return (
      <div style={{background: '#efefef', padding: '20px 0'}}>
        <div className="view-detail-book" style={{maxWidth: 1440, margin: '0 auto', minHeight: 'calc(100vh - 150px)'}}>
          <div style={{padding: '20px', background: '#fff', borderRadius: 5}}>
            {dataBook && dataBook._id ? (
              <Row gutter={[20, 20]}>
                <Col md={10} sm={0} xs={0}>
                  <ImageGallery
                    ref={refGallery}
                    items={dataBook?.items ?? []}
                    showPlayButton={false} //hide play button
                    showFullscreenButton={false} //hide fullscreen button
                    renderLeftNav={() => <></>} //left arrow === <> </>
                    renderRightNav={() => <></>} //right arrow === <> </>
                    slideOnThumbnailOver={true} //onHover => auto scroll images
                    onClick={() => handleOnClickImage()}
                  />
                </Col>
                <Col md={14} sm={24}>
                  <Col md={0} sm={24} xs={24}>
                    <ImageGallery
                      ref={refGallery}
                      items={dataBook?.items ?? []}
                      showPlayButton={false} //hide play button
                      showFullscreenButton={false} //hide fullscreen button
                      renderLeftNav={() => <></>} //left arrow === <> </>
                      renderRightNav={() => <></>} //right arrow === <> </>
                      showThumbnails={false}
                    />
                  </Col>
                  <Col span={24}>
                    <div className="author">
                      Tác giả: <a href="#">{dataBook.author}</a>{' '}
                    </div>
                    <div className="title">{dataBook.mainText}</div>
                    <div className="rating">
                      <Rate value={5} disabled style={{color: '#ffce3d', fontSize: 12}} />
                      <span className="sold">
                        <Divider type="vertical" />
                        {dataBook.sold} Đã bán
                      </span>
                    </div>
                    <div className="price">
                      <span className="currency">
                        {new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(dataBook.price)}
                      </span>
                    </div>
                    <div className="delivery">
                      <div>
                        <span className="left">Vận chuyển</span>
                        <span className="right">Miễn phí vận chuyển</span>
                      </div>
                    </div>
                    <div className="quantity">
                      <span className="left">Số lượng</span>
                      <span className="right">
                        <button onClick={() => handleChangeButton('MINUS')}>
                          <MinusOutlined />
                        </button>
                        <input  value={currentQuantity} onChange={(e) => handleChangeInput(e.target.value)} />
                        <button onClick={() => handleChangeButton('PLUS')}>
                          <PlusOutlined />
                        </button>
                      </span>
                    </div>
                    {/* <div className="quantity">
                      <span className="left">Số lượng</span>
                      <span className="right">
                      <Space>
                      <InputNumber size="large" min={1} max={dataBook.quantity} defaultValue={1}
                        onChange={handleChangeButtonAtd}
                      /></Space>
                      </span>
                    </div> */}
                    <div className="buy">
                      <button className="cart" onClick={() => handleAddToCart(currentQuantity, dataBook)}>
                        <BsCartPlus className="icon-cart" />
                        <span>Thêm vào giỏ hàng</span>
                      </button>
                      <button onClick={()=>navigate('/order')} className="now">Mua ngay</button>
                    </div>
                  </Col>
                </Col>
              </Row>
            ) : (
              <BookLoader />
            )}
          </div>
        </div>
        <ModalGallery
          isOpen={isOpenModalGallery}
          setIsOpen={setIsOpenModalGallery}
          currentIndex={currentIndex}
          items={dataBook?.items ?? []}
          title={dataBook.mainText}
        />
      </div>
    );
}

export default ViewDetail;