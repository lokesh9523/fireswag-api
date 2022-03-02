import { Request, Response, Application } from 'express';
import { checkJwt } from '../middleware/accounts';
import { ResponseFormat } from '../models/swagger';
// import { imageUpload } from '../lib/image-upload';
import { csvUpload } from '../lib/csv-upload';
import { UploadController } from '../controllers/upload';
import { AccountsController } from '../controllers/accounts';
import { ProductTypeController } from '../controllers/product-type';
import { ProductsController } from '../controllers/products';
import { UserController } from '../controllers/user';
import { checkUserJwt } from '../middleware/user';
export class Routes {

  public uploadController: UploadController = new UploadController();
  public accountsController: AccountsController = new AccountsController();
  public productTypeController: ProductTypeController = new ProductTypeController();
  public productsController: ProductsController = new ProductsController();
  public userController: UserController = new UserController();
  public routes(app: Application): Application {

    app.route('/')
      .get(this.sendSuccess);

    app.route('/eks-elb-healthcheck')
      .get(this.sendSuccess);

    app.route('/login')
      .post((req, res) => this.accountsController.loginAccount(req, res));

    app.route('/signup')
      .post(checkJwt, (req, res) => this.accountsController.addAccount(req, res));
    //product Type

    app.route('/product-type/:id')
      .get(checkJwt, (req, res) => this.productTypeController.getProductTypeById(req, res))
      .put(checkJwt, (req, res) => this.productTypeController.updateProductById(req, res))
      .delete(checkJwt, (req, res) => this.productTypeController.deleteProductTypeId(req, res));

    app.route('/product-type')
      .get(checkJwt, (req, res) => this.productTypeController.getAllProductType(req, res))
      .post(checkJwt, (req, res) => this.productTypeController.addProductType(req, res));

    //products

    app.route('/products/:id')
      .get(checkJwt, (req, res) => this.productsController.getProductById(req, res))
      .put(checkJwt, (req, res) => this.productsController.updateProductById(req, res))
      .delete(checkJwt, (req, res) => this.productsController.deleteProductById(req, res));

    app.route('/products')
      .get(checkJwt, (req, res) => this.productsController.getAllProductByType(req, res))
      .post(checkJwt, (req, res) => this.productsController.addProduct(req, res));

    //users
    app.route('/user/:id')
      .get(checkJwt, (req, res) => this.userController.getUserById(req, res))
      .put(checkJwt, (req, res) => this.userController.updateUserById(req, res));

    app.route('/users')
      .get(checkJwt, (req, res) => this.userController.getAllUsers(req, res));

    app.route('/users/search')
      .post(checkJwt, (req, res) => this.userController.getUsersByIds(req, res));

    // Upload Image
    app.route('/upload-image')
      .post(checkJwt, (req, res) => this.uploadController.uploadFile(req, res));

    //store-users
    app.route('/store/products/:id')
      .get((req, res) => this.userController.getProductById(req, res));

    app.route('/store/products')
      .get((req, res) => this.userController.getAllProductByType(req, res))
      .post((req, res) => this.userController.searchProduct(req, res));

    app.route('/store/product-type')
      .get((req, res) => this.userController.getAllProductType(req, res))

    app.route('/store/signup')
      .post((req, res) => this.userController.addUser(req, res));

    app.route('/store/login')
      .post((req, res) => this.userController.loginUser(req, res));

    app.route('/store/user-address/:id')
      .get(checkUserJwt, (req, res) => this.userController.addUserAddress(req, res))
      .post(checkUserJwt, (req, res) => this.userController.updateUserAddress(req, res))
      .delete(checkUserJwt, (req, res) => this.userController.deleteUserAddressById(req, res));

    app.route('/store/user-address')
      .get(checkUserJwt, (req, res) => this.userController.addUserAddress(req, res))
      .post(checkUserJwt, (req, res) => this.userController.updateUserAddress(req, res));


    app.route('*').get(this.send404);
    app.route('*').post(this.send404);
    app.route('*').put(this.send404);
    app.route('*').delete(this.send404);

    return app;
  }

  sendSuccess(req: Request, res: Response) {
    let responseFormat: ResponseFormat = {
      success: true,
      message: 'FireSwag Backend API Running!'
    };
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify(responseFormat, undefined, 2));
  }

  send404(req: Request, res: Response) {
    let responseFormat: ResponseFormat = {
      success: false,
      message: 'Cannot ' + req.method + ' ' + req.originalUrl
    };
    res.setHeader('Content-Type', 'application/json');
    res.status(404).send(JSON.stringify(responseFormat, undefined, 2));
  }
}
