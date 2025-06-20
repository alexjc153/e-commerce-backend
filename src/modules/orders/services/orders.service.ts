import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto } from '@orders/dtos/order.dto';
import { OrderProducts } from '@orders/entities/order-products.entity';
import { Order } from '@orders/entities/order.entity';
import { Product } from '@products/entities/products.entity';
import { User } from '@users/entities/user.entity';
import { customAlphabet } from 'nanoid';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger('OrdersService');
  private readonly nanoid = customAlphabet(
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    4,
  );

  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll() {
    try {
      return await this.ordersRepository.find({
        relations: {
          user: true,
          orderProducts: {
            product: true,
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findByUser(userId: string) {
    try {
      const orders = await this.ordersRepository.find({
        where: {
          user: { uuid: userId },
        },
        relations: {
          orderProducts: {
            product: true,
          },
        },
        order: {
          createdAt: 'DESC',
        },
      });
      return orders;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async create(payload: CreateOrderDto): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Obtener el usuario
      const user = await queryRunner.manager.findOneBy(User, {
        uuid: payload.userId,
      });
      if (!user) {
        throw new NotFoundException(`User with id ${payload.userId} not found`);
      }

      // Generar el número de orden
      const orderNumber = this.generateOrderNumber();

      // Crear la orden
      const order = new Order();
      order.user = user;
      order.total = payload.total;
      order.order_number = orderNumber;

      // Guardar la orden base
      const savedOrder = await queryRunner.manager.save(Order, order);

      // Crear y guardar los productos de la orden
      const orderProducts = await this.createOrderProducts(
        savedOrder,
        payload.products,
        queryRunner,
      );
      await queryRunner.manager.save(OrderProducts, orderProducts);

      await queryRunner.commitTransaction();
      return savedOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Error en OrdersService.create:', error);
      throw new InternalServerErrorException('Error al crear la orden');
    } finally {
      await queryRunner.release();
    }
  }

  // Genera el número de orden incremental
  private generateOrderNumber() {
    try {
      const now = new Date();
      const year = now.getFullYear().toString().slice(-2);
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const nanoidPart = this.nanoid();

      const orderNumber = `${year}${nanoidPart}${month}${day}`;

      return orderNumber;
    } catch (error) {
      this.logger.error('Error generando número de orden', error);
      throw new InternalServerErrorException(
        'No se pudo generar el número de orden',
      );
    }
  }

  // Crea instancias de OrderProducts basadas en el DTO
  private async createOrderProducts(
    order: Order,
    productsDto: CreateOrderDto['products'],
    queryRunner: ReturnType<DataSource['createQueryRunner']>,
  ): Promise<OrderProducts[]> {
    const orderProducts: OrderProducts[] = [];

    for (const p of productsDto) {
      const product = await queryRunner.manager.findOneBy(Product, {
        uuid: p.productId,
      });
      if (!product) {
        throw new NotFoundException(`Product with id ${p.productId} not found`);
      }

      const orderProduct = new OrderProducts();
      orderProduct.order = order;
      orderProduct.product = product;
      orderProduct.quantity = p.quantity;
      orderProduct.price = p.price;

      orderProducts.push(orderProduct);
    }

    return orderProducts;
  }
}
