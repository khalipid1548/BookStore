
import {Layout} from 'antd'

import './footer.scss'

function index() {
	return (
	
		<div className='body'>
			<footer>
				<div class='container'>
					<div class='sec about'>
						<h2>About</h2>
						<p>
							Lorem ipsum, dolor sit amet consectetur adipisicing elit. Veritatis ullam
							tempora molestias earum itaque ex dolorum aperiam consequatur, in nisi sint
							mollitia nesciunt modi ratione.
						</p>
						<ul class='sci'>
							<li>
								<a href='#'>
									<i class='fa-brands fa-facebook-f'></i>
								</a>
							</li>
							<li>
								<a href='#'>
									<i class='fa-brands fa-whatsapp'></i>
								</a>
							</li>
							<li>
								<a href='#'>
									<i class='fa-brands fa-twitter'></i>
								</a>
							</li>
							<li>
								<a href='#'>
									<i class='fa-brands fa-instagram'></i>
								</a>
							</li>
							<li>
								<a href='#'>
									<i class='fa-brands fa-youtube'></i>
								</a>
							</li>
						</ul>
					</div>
					<div class='sec quicklink'>
						<h2>Support</h2>
						<ul>
							<li>
								<a href='#'>FAQ</a>
							</li>
							<li>
								<a href='#'>Privacy Policy</a>
							</li>
							<li>
								<a href='#'>Help</a>
							</li>
							<li>
								<a href='#'>Contact</a>
							</li>
						</ul>
					</div>
					<div class='sec quicklink'>
						<h2>Support</h2>
						<ul>
							<li>
								<a href='#'>FAQ</a>
							</li>
							<li>
								<a href='#'>Privacy Policy</a>
							</li>
							<li>
								<a href='#'>Help</a>
							</li>
							<li>
								<a href='#'>Contact</a>
							</li>
						</ul>
					</div>
					<div class='sec contact'>
						<h2>Contact Us</h2>
						<ul class='info'>
							<li>
								<span>
									<i class='fa-solid fa-phone'></i>
								</span>
								<p>
									<a href=''>+1 234 576</a>
								</p>
							</li>
							<li>
								<span>
									<i class='fa-solid fa-envelope'></i>
								</span>
								<p>
									<a href=''>email@gmail.com</a>
								</p>
							</li>
						</ul>
					</div>
				</div>
				<div class='copyright'>
					<p>Copyright 2034 . All rights reserved.</p>
				</div>
			</footer>
		</div>
	)
}

export default index
