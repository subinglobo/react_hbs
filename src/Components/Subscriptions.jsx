import assets from '../assets/assets'

const Subscriptions = () => {

    const { subscribers } = assets

    return (
        <div className='sub p-[20px]'>
            <h4>SUBSCRIPTIONS</h4>
            <ul className='sub-list'>
                {
                    subscribers.map((sub, index) => (
                        <li key={index}>
                            <div className="sub-img">
                                <img src="" alt="" />
                            </div>
                            <span className='name'>{sub.name}</span>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default Subscriptions
