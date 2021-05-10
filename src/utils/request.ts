import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import { AxiosResponse } from "axios";
import { Observable } from "rxjs";

// Needed since HTTP Requests that returns 400-500 will throw an error.
export async function normalizeRequest<T = any>(
  req: Observable<AxiosResponse<T>>
): Promise<AxiosResponse<T>> {
  try {
    return await req.toPromise();
  } catch (err) {
    return err;
  }
}

export async function requestThrowNestException<T = any>(
  req: Observable<AxiosResponse<T>>
): Promise<AxiosResponse<T>> {
  try {
    return await req.toPromise();
  } catch (err) {
    if (err.response.status === 401) {
      throw new UnauthorizedException(err.response.data.message);
    }
    if (err.response.status === 404) {
      throw new NotFoundException(err.response.data.message);
    }
    throw err;
  }
}
