import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { Restaurant } from "../entities/Restaurant";
import { FieldError, MyContext } from "../types";

@InputType()
class RestaurantInput {
  @Field()
  name: string;

  @Field()
  description: string;
}

@ObjectType()
class RestaurantResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Restaurant, { nullable: true })
  restaurant?: Restaurant;
}

@Resolver()
export class RestaurantResolver {
  @Query(() => [Restaurant])
  async getRestaurants(
    @Ctx() { connection }: MyContext
  ): Promise<Restaurant[]> {
    const restaurantRepository = connection.getRepository(Restaurant);
    const restaurants = await restaurantRepository.find();
    return restaurants;
  }

  @Query(() => RestaurantResponse)
  async getRestaurant(
    @Ctx() { connection }: MyContext,
    @Arg("id") id: string
  ): Promise<RestaurantResponse> {
    try {
      const restaurantRepository = connection.getRepository(Restaurant);
      const restaurant = await restaurantRepository.findOne(id);
      if (!restaurant)
        return {
          errors: [
            {
              message: "Restaurant doesn't exist",
            },
          ],
        };
      return {
        restaurant,
      };
    } catch (error) {
      console.log(error);
      return {
        errors: [
          {
            message: "Error fetching restaurant",
          },
        ],
      };
    }
  }

  @Mutation(() => RestaurantResponse)
  async createRestaurant(
    @Ctx() { connection }: MyContext,
    @Arg("restaurant") restaurantInput: RestaurantInput
  ): Promise<RestaurantResponse> {
    const restaurantRepository = connection.getRepository(Restaurant);
    const restaurant = new Restaurant();
    restaurant.name = restaurantInput.name;
    restaurant.description = restaurantInput.description;

    try {
      await restaurantRepository.save(restaurant);
      return {
        restaurant,
      };
    } catch (e) {
      console.log("ERROR: ", e);
      return {
        errors: [{ message: "Unexpected error occured" }],
      };
    }
  }

  @Mutation(() => Boolean)
  async updateRestaurant(
    @Ctx() { connection }: MyContext,
    @Arg("restaurant") restaurantInput: RestaurantInput,
    @Arg("id") restaurantId: string
  ): Promise<Boolean> {
    const restaurantRepository = connection.getRepository(Restaurant);
    const restaurant = await restaurantRepository.findOne(restaurantId);
    if (!restaurant) return false;

    try {
      await restaurantRepository.update(
        { id: restaurantId },
        { name: restaurantInput.name, description: restaurantInput.description }
      );
      return true;
    } catch (e) {
      console.log("Error updating restaurant: ", e);
      return false;
    }
  }

  @Mutation(() => RestaurantResponse)
  async deleteRestaurant(
    @Ctx() { connection }: MyContext,
    @Arg("id") id: string
  ): Promise<RestaurantResponse> {
    const restaurantRepository = connection.getRepository(Restaurant);
    try {
      const restaurant = await restaurantRepository.findOne(id);
      if (!restaurant)
        return {
          errors: [
            {
              message: "Cannot find restaurant.",
            },
          ],
        };
      const restaurantCopy: Restaurant = { ...restaurant };
      await restaurantRepository.remove([restaurant]);
      return {
        restaurant: restaurantCopy,
      };
    } catch (error) {
      console.log(error);
      return {
        errors: [
          {
            message: "Something went wrong",
          },
        ],
      };
    }
  }
}
