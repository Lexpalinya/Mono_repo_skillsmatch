import type { IMemberAdminViewDtoType } from "@skillsmatch/dto";

export default function ViewHeader({
  data,
}: {
  data: IMemberAdminViewDtoType;
}) {
  return (
    <div className="relative w-full mb-24">
      <div className="bg-gray-300">
        <img
          src={data?.background ?? ""}
          alt={data?.username}
          className="object-contain h-32 w-full"
        />
      </div>

      <div className="absolute left-1/2 bottom-0 translate-x-[-40%] translate-y-2/3">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-muted border-1 border-background shadow-lg">
            {data?.profile ? (
              <img
                src={data.profile}
                alt={data.username}
                className="object-contain bg-cover h-full w-full"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {data?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-lg">{data?.username}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
