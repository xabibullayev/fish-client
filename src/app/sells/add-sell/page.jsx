"use client";
import styles from "./page.module.scss";
import { KeyboardBackspace } from "@mui/icons-material";
import PrimaryBtn from "@/components/primaryBtn/PrimaryBtn";
import { useEffect, useState } from "react";
import Input from "@/components/input/Input";
import Select from "@/components/select/Select";
import DatePick from "@/components/datePicker/DatePicker";
import { fetchData } from "@/utils/fetchData";
import CheckBox from "@/components/checkBox/CheckBox";
import { handleSubmit } from "@/utils/handleSubmit";
import CustumerModal from "@/components/custumerModal/CustumerModal";
import { format } from "date-fns";

export default function AddSell() {
  const [purchases, setPurchases] = useState([]);
  const [products, setProducts] = useState([]);
  const [custumers, setCustumers] = useState([]);
  const [sell, setSell] = useState({
    purchase: "Выберите поток",
    product: "Выберите продукт",
    custumer: "Выберите клиента",
    amount: "",
    price: "",
    discount: "",
    addedDate: new Date(),
  });

  const [checkClient, setCheckClient] = useState(false);
  const [isModalOPen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData("/products", setProducts);

    fetchData("/custumers", setCustumers);

    fetchData("/purchases", setPurchases);
  }, [isModalOPen, sell]);

  const pageHandleSubmit = (e) => {
    e.preventDefault();

    const data = {
      ...sell,
      price: sell.price * sell.amount - sell.discount,
      discount: sell.discount === "" ? 0 : sell.discount,
    };

    handleSubmit(e, "create", "sells", data, setSell);
    console.log(sell);

    setSell({
      purchase: "Выберите поток",
      product: "Выберите продукт",
      custumer: "Выберите клиента",
      amount: "",
      price: "",
      discount: "",
      addedDate: new Date(),
    });
  };

  return (
    <div className={styles.addProduct}>
      <h1>Продажи</h1>

      <div className={styles.form}>
        <div className={styles.top}>
          <h1>Добавить новую продажу</h1>
          <PrimaryBtn
            type="link"
            title="Вернуться к списку"
            url="/sells"
            icon={<KeyboardBackspace />}
          >
            <KeyboardBackspace />
            Вернуться к списку
          </PrimaryBtn>
        </div>

        <form onSubmit={pageHandleSubmit}>
          <div className={styles.inputGroup}>
            <div className={styles.formInput} hidden>
              <select
                required
                value={sell.purchaseId}
                onChange={(e) =>
                  setSell((prev) => ({
                    ...prev,
                    purchase: e.target.value,
                  }))
                }
              >
                <option value="" hidden>
                  {sell.purchase}
                </option>
                {purchases.map((purchase) => (
                  <option key={purchase._id} value={purchase._id}>
                    {purchase.product.title +
                      " " +
                      purchase.supplier.title +
                      " " +
                      purchase.amount +
                      "kg" +
                      " " +
                      format(purchase.addedDate, "dd.MM.yyyy")}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formInput}>
              <Select
                name="product"
                mapData={products}
                text="title"
                defValue={sell.product}
                setData={setSell}
              />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <div className={styles.formInputCheck}>
              <CheckBox
                id="checkClient"
                value={checkClient}
                setData={setCheckClient}
              />
              <label htmlFor="checkClient">Bez client</label>
            </div>

            {checkClient ? (
              <div>
                <Input
                  type="text"
                  name="custumer"
                  placeholder={sell.custumer}
                  value={sell.custumer}
                  setData={setSell}
                  required={true}
                />
              </div>
            ) : (
              <div className={styles.client}>
                <div className={styles.formInput}>
                  <Select
                    name="custumer"
                    mapData={custumers}
                    text="fullname"
                    defValue={sell.custumer}
                    setData={setSell}
                  />
                </div>

                <div className={styles.formInput}>
                  <div onClick={() => setIsModalOpen(true)}>
                    <PrimaryBtn type="button">+</PrimaryBtn>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.formInput}>
              <Input
                type="number"
                name="amount"
                placeholder="Количество"
                value={sell.amount}
                setData={setSell}
                required={true}
              />
            </div>
            <div className={styles.formInput}>
              <Input
                type="number"
                name="price"
                placeholder="Цена"
                value={sell.price}
                setData={setSell}
                required={true}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.formInput}>
              <Input
                type="number"
                name="discount"
                placeholder="Discount"
                value={sell.discount}
                setData={setSell}
                required={false}
              />
            </div>
            <div className={styles.formInput}>
              <DatePick defDate={sell.addedDate} setDate={setSell} />
            </div>
          </div>

          <div className={styles.bottom}>
            <div className={styles.calc}>
              <p>Total:</p>
              <b>
                {Intl.NumberFormat("uz-UZ")
                  .format(sell.price * sell.amount - sell.discount)
                  .replace(/,/g, " ")}

                <b> SWM</b>
              </b>
            </div>
          </div>

          <PrimaryBtn type="submit">Сохранять</PrimaryBtn>
        </form>
      </div>

      <CustumerModal
        isModalOpen={isModalOPen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
}
