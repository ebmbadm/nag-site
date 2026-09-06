export const dynamic = "force-static";

export function GET(request: Request) {
  return Response.redirect(new URL("/istoriya", request.url), 308);
}
