export const ContractManagement = () => {
  return (
    <div className="flex h-full gap-4">
      <section className="h-full w-[59.875rem] bg-white">
        <h3>입점계약서</h3>
      </section>

      <div className="grid h-full grid-rows-2 gap-4">
        <section className="w-[25.125rem] bg-white">
          <h3>계약서 템플릿</h3>
        </section>

        <section className="w-[25.125rem] bg-white">
          <h3>완료된 계약</h3>
        </section>
      </div>
    </div>
  );
};
